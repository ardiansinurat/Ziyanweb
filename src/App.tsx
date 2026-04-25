import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MoreVertical, Cloud, Star, Sparkles, Volume2, Bell, Loader2, Info, Eye, EyeOff, Settings, ChevronDown, Check } from 'lucide-react';
import './index.css';

interface Message {
  id: string;
  text: string;
  pinyin?: string;
  translation?: string;
  correction?: string;
  sender: 'user' | 'ai';
}

function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: '1',
        text: '你好！今天你想学什么？',
        pinyin: 'Nǐ hǎo! Jīntiān nǐ xiǎng xué shénme?',
        translation: 'Halo! Hari ini kamu ingin belajar apa?',
        sender: 'ai'
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState(() => localStorage.getItem('user_name') || "snowdropchi");
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('user_avatar') || "https://i.pravatar.cc/150?img=1");
  const [theme, setTheme] = useState(() => localStorage.getItem('user_theme') || "light-pastel");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Temporary state for the modal
  const [tempName, setTempName] = useState(userName);
  const [tempAvatar, setTempAvatar] = useState(userAvatar);
  const [tempTheme, setTempTheme] = useState(theme);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions = [
    { id: 'light-pastel', label: 'Pastel (Saat ini)', category: 'Light Mode' },
    { id: 'light-vintage', label: 'Vintage', category: 'Light Mode' },
    { id: 'light-minimalist', label: 'Minimalist / Standard', category: 'Light Mode' },
    { id: 'dark-astronaut', label: 'Astronaut (Biru/Hitam)', category: 'Dark Mode' },
    { id: 'dark-bintang', label: 'Bintang (Malam Berkilau)', category: 'Dark Mode' },
    { id: 'dark-aurora', label: 'Aurora (Hijau/Ungu)', category: 'Dark Mode' },
  ];

  useEffect(() => {
    localStorage.setItem('user_name', userName);
    localStorage.setItem('user_avatar', userAvatar);
    localStorage.setItem('user_theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [userName, userAvatar, theme]);

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user'
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      let historyContents = newMessages.map(msg => {
        let contentText = msg.text;
        if (msg.sender === 'ai') {
          contentText = JSON.stringify({
            text: msg.text,
            pinyin: msg.pinyin,
            translation: msg.translation,
            correction: msg.correction
          });
        }
        return {
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: contentText }]
        };
      });

      // Gemini API requires the first message to be from the user
      if (historyContents.length > 0 && historyContents[0].role === 'model') {
        historyContents.unshift({
          role: 'user',
          parts: [{ text: 'Halo, mari kita mulai belajar bahasa Mandarin.' }]
        });
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBd1MY7h-N44KXahIvYMq402KQJfL05dPc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: "Kamu adalah 'Ziyan', tutor dan teman ngobrol bahasa Mandarin. Pengguna sedang belajar bahasa Mandarin.\nTugasmu:\n1. Membalas chat pengguna dengan bahasa Mandarin yang senatural mungkin.\n2. Jika pengguna melakukan kesalahan tata bahasa atau pemilihan kata, berikan koreksi. Jika tidak ada kesalahan, isi dengan string kosong ''.\n3. Format balasanmu WAJIB berupa JSON dengan struktur:\n{\n  \"text\": \"(balasan bahasa Mandarin, gunakan aksara Hanzi)\",\n  \"pinyin\": \"(pinyin dari balasan)\",\n  \"translation\": \"(terjemahan balasan dalam bahasa Indonesia)\",\n  \"correction\": \"(penjelasan koreksi dalam bahasa Indonesia, jika ada)\"\n}\nJangan tambahkan markdown ```json, kembalikan json murni."
              }
            ]
          },
          contents: historyContents
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API Request failed');
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiText) {
        let cleanText = aiText.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/```/g, '').trim();
        }

        try {
          const parsed = JSON.parse(cleanText);
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: parsed.text || "抱歉，我没听懂。",
            pinyin: parsed.pinyin || "Bàoqiàn, wǒ méi tīng dǒng.",
            translation: parsed.translation || "Maaf, saya tidak mengerti.",
            correction: parsed.correction || "",
            sender: 'ai'
          };
          setMessages(prev => [...prev, aiMessage]);
          playAudio(parsed.text || "抱歉，我没听懂。");
        } catch (parseError) {
          console.error("Failed to parse JSON:", cleanText);
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: cleanText,
            sender: 'ai'
          };
          setMessages(prev => [...prev, aiMessage]);
          playAudio(cleanText);
        }
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "抱歉，系统出现了一些问题。",
        pinyin: "Bàoqiàn, xìtǒng chūxiàn le yīxiē wèntí.",
        translation: "Maaf, terjadi kesalahan pada sistem. Silakan coba lagi.",
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
      playAudio("抱歉，系统出现了一些问题。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="theme-bg-layer">
        {theme === 'light-vintage' && <div className="vintage-pattern"></div>}
        {theme === 'light-minimalist' && <div className="minimalist-pattern"></div>}
        {theme === 'dark-bintang' && <div className="stars-pattern"></div>}
        {theme === 'dark-astronaut' && <div className="astronaut-pattern"></div>}
        {theme === 'dark-aurora' && <div className="aurora-pattern"></div>}
      </div>
      <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar glass-panel">
        <div className="profile-card">
          {userAvatar ? (
            <img src={userAvatar} alt="Profile" className="avatar" style={{ objectFit: 'cover' }} />
          ) : (
            <div className="avatar">{userName.substring(0,2).toUpperCase()}</div>
          )}
          <div className="profile-info" style={{ flex: 1 }}>
            <h2>{userName}</h2>
            <p>Beginner (HSK 1)</p>
          </div>
          <button className="btn-icon" onClick={() => {
            setTempName(userName);
            setTempAvatar(userAvatar);
            setTempTheme(theme);
            setIsSettingsOpen(true);
          }}>
            <Settings size={20} />
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <Cloud className="stat-icon" color="var(--accent)" size={28} />
            <span className="stat-value">12</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat-box">
            <Star className="stat-icon" color="var(--warning)" size={28} />
            <span className="stat-value">85%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat-box">
            <Sparkles className="stat-icon" color="var(--primary)" size={28} />
            <span className="stat-value">142</span>
            <span className="stat-label">Words</span>
          </div>
        </div>

        <div className="daily-reminder">
          <h3><Bell size={18} /> Daily Reminder</h3>
          <p>Don't forget your 15-minute conversation practice today! Your partner Ziyan is waiting.</p>
          <button className="btn-primary">Start Practice</button>
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="chat-section glass-panel">
        <div className="chat-header">
          <div className="tutor-info">
            <img src="https://i.pravatar.cc/150?img=32" alt="Tutor" className="tutor-avatar" />
            <div className="tutor-details">
              <h2>Ziyan <span className="status-dot"></span></h2>
              <p>Native Speaker • Online</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn-icon" 
              onClick={() => setShowTranslations(!showTranslations)}
              title={showTranslations ? "Sembunyikan Terjemahan" : "Tampilkan Terjemahan"}
            >
              {showTranslations ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <button className="btn-icon">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-bubble">
                {msg.pinyin && <span className="pinyin">{msg.pinyin}</span>}
                <div className="text-content" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {msg.text}
                  {msg.sender === 'ai' && (
                    <Volume2 
                      size={16} 
                      style={{ cursor: 'pointer', opacity: 0.8 }} 
                      onClick={() => playAudio(msg.text)}
                    />
                  )}
                </div>
                {msg.translation && showTranslations && <div className="translation">{msg.translation}</div>}
                {msg.correction && (
                  <div className="correction">
                    <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{msg.correction}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai">
              <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 className="animate-spin" size={16} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ziyan is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <form onSubmit={handleSend} className="input-wrapper">
            <button 
              type="button" 
              className={`btn-icon ${isRecording ? 'recording' : ''}`}
              onClick={() => setIsRecording(!isRecording)}
              disabled={isLoading}
            >
              <Mic size={20} />
            </button>
            <input 
              type="text" 
              className="chat-input"
              placeholder="Type in Pinyin, English, or Chinese characters..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="btn-icon btn-send" disabled={!input.trim() || isLoading}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h2>Edit Profile & Tema</h2>
            
            <div className="form-group">
              <label>Nama Profil</label>
              <input 
                type="text" 
                className="form-input" 
                value={tempName} 
                onChange={e => setTempName(e.target.value)} 
              />
            </div>
            
            <div className="form-group">
              <label>Foto Profil (Upload File)</label>
              <input 
                type="file" 
                accept="image/*"
                className="form-input" 
                style={{ padding: '8px' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setTempAvatar(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
              {tempAvatar && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={tempAvatar} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--glass-border)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Preview</span>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>Tema Tampilan</label>
              <div className="custom-dropdown-container" ref={dropdownRef}>
                <div 
                  className="custom-dropdown-trigger" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{themeOptions.find(t => t.id === tempTheme)?.label}</span>
                  <ChevronDown size={18} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </div>
                
                {isDropdownOpen && (
                  <div className="custom-dropdown-menu glass-panel">
                    <div className="dropdown-category">Light Mode</div>
                    {themeOptions.filter(t => t.category === 'Light Mode').map(t => (
                      <div 
                        key={t.id} 
                        className={`dropdown-item ${tempTheme === t.id ? 'active' : ''}`}
                        onClick={() => {
                          setTempTheme(t.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span>{t.label}</span>
                        {tempTheme === t.id && <Check size={16} className="active-icon" />}
                      </div>
                    ))}
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-category">Dark Mode</div>
                    {themeOptions.filter(t => t.category === 'Dark Mode').map(t => (
                      <div 
                        key={t.id} 
                        className={`dropdown-item ${tempTheme === t.id ? 'active' : ''}`}
                        onClick={() => {
                          setTempTheme(t.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span>{t.label}</span>
                        {tempTheme === t.id && <Check size={16} className="active-icon" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setIsSettingsOpen(false)}>Batal</button>
              <button className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '10px 24px' }} onClick={() => {
                setUserName(tempName);
                setUserAvatar(tempAvatar);
                setTheme(tempTheme);
                setIsSettingsOpen(false);
              }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default App;
