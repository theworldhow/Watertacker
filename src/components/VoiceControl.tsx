import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Waves, Volume2 } from 'lucide-react';

interface VoiceControlProps {
    onAdd: (amount: number, type: string) => void;
    isPremium: boolean;
}

export default function VoiceControl({ onAdd, isPremium }: VoiceControlProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState('');

    // Use a ref to keep track of the recognition instance
    const recognitionRef = useRef<any>(null);
    const isListeningRef = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true; // Keep listening
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                isListeningRef.current = true;
                setFeedback('Listening... Say "Hey Hydrate, I drank water"');
            };

            recognitionRef.current.onend = () => {
                // Auto-restart if it was supposed to be listening (simulating always-on)
                // Note: Browsers may block this if page is not active, but we try our best
                if (isListeningRef.current) {
                    try {
                        recognitionRef.current.start();
                    } catch (e) {
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
                if (event.error === 'no-speech') {
                    setFeedback('No speech detected. Try again.');
                } else {
                    console.error("Speech recognition error", event.error);
                    setFeedback('Error: ' + (event.error || 'accessing microphone'));
                }
                setIsListening(false);
                isListeningRef.current = false;
            };

            recognitionRef.current.onresult = (event: any) => {
                const lastResultIndex = event.results.length - 1;
                const text = event.results[lastResultIndex][0].transcript.toLowerCase();
                setTranscript(text);
                processCommand(text);
            };
        } else {
            setFeedback("Voice not supported on this browser.");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            // Try to select a pleasant voice
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English'));
            if (preferredVoice) utterance.voice = preferredVoice;
            window.speechSynthesis.speak(utterance);
        }
    };

    const processCommand = (text: string) => {
        // Optional: Require "Hey Hydrate" wake word?
        // For now, we'll allow commands directly but verify the intent.

        let matched = false;
        let type = '';
        let amount = 0;

        // Simple keyword matching
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
            onAdd(amount, type);

            const compliments = ["Great job!", "Way to go!", "Hydration hero!", "Keep it up!", "Nice work!"];
            const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
            const response = `Added ${type}. ${randomCompliment}`;

            setFeedback(response);
            speak(response);

            // Optional: visual reset after a moment
            setTimeout(() => {
                if (isListeningRef.current) {
                    setFeedback('Listening...');
                }
            }, 2000);
        }
    };

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    if (!recognitionRef.current) {
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
                {feedback && (
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
