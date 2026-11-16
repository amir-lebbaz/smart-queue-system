// Web Speech API Native Arabic Announcement (Zero external dependencies)

export function speakArabicAnnouncement(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;

    // Look for Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export function announceTicketCall(ticketNumber: number, staffTitle: string, sectorLabel: string): void {
  const message = `الرقم ${ticketNumber}، تفضل بالدخول عند ${staffTitle}`;
  speakArabicAnnouncement(message);
}
