    let timeLeft = 25 * 60; // 25 minutes in seconds
        let isActive = false;
        let currentMode = 'kerja';
        let timerInterval = null;
        let totalTime = 25 * 60;

        // Audio notification (using Web Audio API to create a simple beep)
        function playNotification() {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        }

        function formatTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            if (hours > 0) {
                return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            } else {
                return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }

        function updateDisplay() {
            document.getElementById('timerDisplay').textContent = formatTime(timeLeft);
            document.getElementById('timerLabel').textContent = isActive ? 'Running...' : 'Ready';
            
            // Update progress bar
            const progress = ((totalTime - timeLeft) / totalTime) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
            
            // Update status
            if (currentMode === 'kerja') {
                document.getElementById('statusText').textContent = 'Fokus pada pekerjaan Anda';
            } else if (currentMode === 'istirahat') {
                document.getElementById('statusText').textContent = 'Waktu istirahat - relaksasi';
            } else if (currentMode === 'istirahat_lama') {
                document.getElementById('statusText').textContent = '25 menit belajar 8 jam main game';
            }
        }

        function startTimer() {
            if (!isActive) {
                isActive = true;
                document.getElementById('startBtn').disabled = true;
                document.getElementById('stopBtn').disabled = false;
                
                timerInterval = setInterval(() => {
                    timeLeft--;
                    updateDisplay();
                    
                    if (timeLeft <= 0) {
                        playNotification();
                        stopTimer();
                        
                        // Auto switch mode
                        if (currentMode === 'kerja') {
                            setMode('istirahat');
                            alert('Waktu kerja selesai! Waktunya istirahat 5 menit.');
                        } else if (currentMode === 'istirahat') {
                            setMode('kerja');
                            alert('Waktu istirahat selesai! Kembali ke kerja 25 menit.');
                        } else if (currentMode === 'istirahat_lama') {
                            setMode('kerja');
                            alert('Istirahat panjang selesai! Waktunya kembali bekerja.');
                        }
                    }
                }, 1000);
            }
        }

        function stopTimer() {
            isActive = false;
            clearInterval(timerInterval);
            document.getElementById('startBtn').disabled = false;
            document.getElementById('stopBtn').disabled = true;
            updateDisplay();
        }

        function setMode(mode) {
            stopTimer();
            currentMode = mode;
            
            // Update button states
            document.getElementById('kerjaBtn').classList.remove('active');
            document.getElementById('istirahatBtn').classList.remove('active');
            document.getElementById('istirahatLamaBtn').classList.remove('active');
            document.getElementById(mode === 'istirahat_lama' ? 'istirahatLamaBtn' : mode + 'Btn').classList.add('active');
            
            // Set time based on mode
            if (mode === 'kerja') {
                timeLeft = 25 * 60; // 25 minutes
                totalTime = 25 * 60;
            } else if (mode === 'istirahat') {
                timeLeft = 5 * 60; // 5 minutes
                totalTime = 5 * 60;
            } else if (mode === 'istirahat_lama') {
                timeLeft = 8 * 60 * 60; // 8 hours
                totalTime = 8 * 60 * 60;
            }
            
            updateDisplay();
        }

        function resetTimer() {
            stopTimer();
            setMode(currentMode);
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateDisplay();
            document.getElementById('stopBtn').disabled = true;
            
            // Add keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.code === 'Space') {
                    e.preventDefault();
                    if (isActive) {
                        stopTimer();
                    } else {
                        startTimer();
                    }
                }
                if (e.key === 'r' || e.key === 'R') {
                    resetTimer();
                }
            });
        });

        // Add double-click to reset
        document.getElementById('timerDisplay').addEventListener('dblclick', resetTimer);