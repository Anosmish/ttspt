async function generateSpeech() {
  const text = document.getElementById("text").value.trim();
  const audio = document.getElementById("audio");

  // 🛑 Empty text check
  if (!text) {
    alert("Please enter some text!");
    return;
  }

  try {
    // ⏳ Loading state
    audio.pause();
    audio.src = "";
    
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    // ❌ API error handling
    if (!res.ok) {
      const errText = await res.text();
      console.error("API Error:", errText);
      alert("TTS Error: " + errText);
      return;
    }

    const blob = await res.blob();

    // ❌ Invalid audio check
    if (!blob || blob.size === 0) {
      alert("Audio generation failed (empty response)");
      return;
    }

    // 🎧 Create audio URL
    const url = URL.createObjectURL(blob);

    // ✅ Force reload audio
    audio.src = url;
    audio.load();

    // ▶️ Play with safe handling
    await audio.play().catch(err => {
      console.warn("Autoplay blocked:", err);
      alert("Click play button manually");
    });

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong: " + error.message);
  }
}
