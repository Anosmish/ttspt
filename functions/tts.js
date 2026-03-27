export async function handler(event) {
  try {
    const { text } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Text is required" })
      };
    }

    const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "playai-tts",
        input: text,
        voice: "alloy"
        // ❌ format हटाया गया
      })
    });

    // ❗ API error handling
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);

      return {
        statusCode: 500,
        body: errorText
      };
    }

    const audioBuffer = await response.arrayBuffer();

    return {
      statusCode: 200,
      headers: {
        // ✅ safer generic type (auto detect)
        "Content-Type": "audio/mpeg"
      },
      body: Buffer.from(audioBuffer).toString("base64"),
      isBase64Encoded: true
    };

  } catch (err) {
    console.error("Server Error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
