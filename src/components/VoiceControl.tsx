import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceControlProps {
    onAdd: (amount: number, type: string) => void;
    isPremium: boolean;
}

export default function VoiceControl({ onAdd }: Omit<VoiceControlProps, 'isPremium'>) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported] = useState(() => {
        return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    });
    const [feedback, setFeedback] = useState('');

    // Use a ref to keep track of the recognition instance
    const recognitionRef = useRef<any>(null);
    const isListeningRef = useRef(false);

    const speak = useCallback((text: string) => {
        if (!text) return;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            // Cancel any current speech to avoid queueing/hanging
            window.speechSynthesis.cancel();

            // Add a small delay to give the audio engine time to switch from recognition to synthesis
            // This often fixes the 'Could not parse SSML' and 'IPCAUClient' errors on iOS
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(text);
                const voices = window.speechSynthesis.getVoices();
                const preferredVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English'));
                if (preferredVoice) utterance.voice = preferredVoice;

                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                utterance.lang = 'en-US';

                window.speechSynthesis.speak(utterance);
            }, 100);
        }
    }, []);

    const processCommand = useCallback((text: string) => {
        let matched = false;
        let type = '';
        let amount = 0;

        if (text.includes('water') || text.includes('hydrate')) {
            type = 'Water';
            amount = 250;
            matched = true;
        } else if (text.includes('coffee')) {
            type = 'Coffee';
            amount = 200;
            matched = true;
        } else if (text.includes('tea')) {
            type = 'Tea';
            amount = 200;
            matched = true;
        } else if (text.includes('soda') || text.includes('coke') || text.includes('pop')) {
            type = 'Soda';
            amount = 330;
            matched = true;
        } else if (text.includes('juice')) {
            type = 'Juice';
            amount = 250;
            matched = true;
        }

        if (matched) {
            // Stop listening before speaking to avoid audio engine conflicts
            if (recognitionRef.current) {
                isListeningRef.current = false;
                try {
                    recognitionRef.current.abort(); // Abort is more immediate
                } catch (e) { console.debug("Abort failed", e); }
                setIsListening(false);
            }

            onAdd(amount, type);

            const compliments = ["Great job!", "Way to go!", "Hydration hero!", "Keep it up!", "Nice work!"];
            const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
            const response = `Added ${type}. ${randomCompliment}`;

            setFeedback(response);
            speak(response);

            // Don't auto-restart listening if we just spoke, let the user trigger it again or use a longer timeout
            // For now, let's keep it manual or simple
        }
    }, [onAdd, speak]);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                isListeningRef.current = true;
                setFeedback('Listening... Say "Hey Hydrate, I drank water"');
            };

            recognitionRef.current.onend = () => {
                if (isListeningRef.current) {
                    try {
                        recognitionRef.current.start();
                    } catch {
                        setIsListening(false);
                        isListeningRef.current = false;
                    }
                } else {
                    setIsListening(false);
                    setFeedback(prev => {
                        if (prev.includes('Listening')) return '';
                        return prev;
                    });
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                const error = event.error;

                // Strictly silence common iOS/Webkit aborted/not-allowed errors
                // We also silence 'no-speech' if we want to be very quiet
                if (error === 'aborted' || error === 'not-allowed' || error === 'service-not-allowed' || error === 'no-speech') {
                    setIsListening(false);
                    isListeningRef.current = false;
                    if (error === 'no-speech') setFeedback(''); // Just clear feedback
                    return;
                }

                // Only log and show actual unexpected errors
                console.error("Speech Recognition Error:", error);
                setFeedback('Error: ' + (error || 'mic access'));
                setIsListening(false);
                isListeningRef.current = false;
            };

            recognitionRef.current.onresult = (event: any) => {
                const lastResultIndex = event.results.length - 1;
                const text = event.results[lastResultIndex][0].transcript.toLowerCase();
                processCommand(text);
            };
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch (e) { }
            }
        };
    }, [processCommand]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    if (!isSupported) {
        return null; // or empty div if not supported
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '30px',
            gap: '10px'
        }}>
            <button
                onClick={toggleListening}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: 'none',
                    background: isListening ? 'var(--danger)' : 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isListening ? '0 0 20px rgba(255, 69, 58, 0.4)' : '0 4px 12px rgba(45, 90, 245, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <div style={{ height: '20px', textAlign: 'center' }}>
                {!isSupported ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Voice not supported</div>
                ) : feedback && (
                    <div style={{
                        color: feedback.includes('Added') ? 'var(--success)' :
                            feedback.includes('Error') || feedback.includes('No speech') ? 'var(--danger)' :
                                'var(--text-muted)',
                        fontSize: '14px',
                        fontWeight: 500
                    }}>
                        {feedback}
                    </div>
                )}
            </div>

            {/* Visual Wave Animation when listening - purely decorative */}
            {isListening && (
                <div style={{ display: 'flex', gap: '4px', height: '10px', alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{
                            width: '4px',
                            height: '100%',
                            background: 'var(--primary)',
                            borderRadius: '2px',
                            animation: `wave 1s infinite ease-in-out ${i * 0.1}s`
                        }} />
                    ))}
                    <style jsx>{`
                        @keyframes wave {
                            0%, 100% { height: 4px; opacity: 0.5; }
                            50% { height: 16px; opacity: 1; }
                        }
                     `}</style>
                </div>
            )}
        </div>
    );
}
