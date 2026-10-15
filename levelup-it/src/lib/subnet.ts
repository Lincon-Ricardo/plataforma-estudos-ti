// Calculadora de sub-redes IPv4 — lógica pura (testável, sem UI).
export interface SubnetResult {
  ip: string; prefix: number;
  mask: string; wildcard: string;
  network: string; broadcast: string;
  firstHost: string; lastHost: string;
  totalAddresses: number; usableHosts: number;
  ipBinary: string; maskBinary: string;
  steps: string[];
}

export function parseIPv4(s: string): number[] | null {
  const parts = s.trim().split(".");
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => (p === "" ? NaN : Number(p)));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  return nums;
}

const toInt = (o: number[]) => ((o[0] * 256 + o[1]) * 256 + o[2]) * 256 + o[3];
const toOctets = (n: number) => [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256];
const toStr = (n: number) => toOctets(n >>> 0).join(".");
const toBin = (o: number[]) => o.map((x) => x.toString(2).padStart(8, "0")).join(".");

export function calcSubnet(ipStr: string, prefix: number): SubnetResult | { error: string } {
  const octets = parseIPv4(ipStr);
  if (!octets) return { error: "IP inválido. Use 4 octetos de 0 a 255 (ex.: 192.168.10.70)." };
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return { error: "Prefixo inválido. Use /0 a /32." };

  const ip = toInt(octets) >>> 0;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const total = 2 ** (32 - prefix);

  let usable: number, first: string, last: string;
  if (prefix === 32) { usable = 1; first = toStr(network); last = toStr(network); }
  else if (prefix === 31) { usable = 2; first = toStr(network); last = toStr(broadcast); }
  else { usable = total - 2; first = toStr(network + 1); last = toStr(broadcast - 1); }

  const hostBits = 32 - prefix;
  const block = 2 ** hostBits;
  const steps = [
    `1. /${prefix} = ${prefix} bits de rede + ${hostBits} bits de host.`,
    `2. Máscara: ${toStr(mask)} (binário ${toBin(toOctets(mask))}).`,
    `3. Bloco de ${block} endereços; a rede é o múltiplo do bloco que contém o IP.`,
    `4. Rede ${toStr(network)} → broadcast ${toStr(broadcast)} → úteis ${first} a ${last} (${usable} hosts).`,
    prefix <= 30
      ? `5. ${ipStr} ${network === (ip & mask) >>> 0 && ip !== network && ip !== broadcast ? "é um host válido" : "confira se não é rede/broadcast"}. Outro IP só é vizinho se cair no mesmo intervalo.`
      : `5. Prefixo /${prefix}: caso especial ponto a ponto / host único.`,
  ];

  return {
    ip: ipStr, prefix, mask: toStr(mask), wildcard: toStr((~mask >>> 0)),
    network: toStr(network), broadcast: toStr(broadcast),
    firstHost: first, lastHost: last,
    totalAddresses: total, usableHosts: usable,
    ipBinary: toBin(octets), maskBinary: toBin(toOctets(mask)), steps,
  };
}
