export function isSuspiciousText(input: string): boolean {
  const lowered = input.toLowerCase();
  const blocked = ["http://", "https://", "telegram", "whatsapp", "crypto", "casino", "viagra"];
  return blocked.some((token) => lowered.includes(token));
}

export function scoreRisk(params: {
  text?: string;
  fileSizeBytes?: number;
  tooFrequent?: boolean;
}): { risk: "low" | "medium" | "high"; reasons: string[] } {
  const reasons: string[] = [];

  if (params.tooFrequent) reasons.push("high_frequency");
  if ((params.fileSizeBytes ?? 0) > 1_500_000) reasons.push("large_file");
  if (params.text && isSuspiciousText(params.text)) reasons.push("suspicious_text");

  const risk = reasons.length >= 2 ? "high" : reasons.length === 1 ? "medium" : "low";
  return { risk, reasons };
}
