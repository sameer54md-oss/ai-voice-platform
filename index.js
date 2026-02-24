const express = require("express");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/voice", async (req, res) => {
  const userSpeech = req.body.SpeechResult || "Hello";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI voice assistant." },
        { role: "user", content: userSpeech }
      ],
    });

    const aiReply = completion.choices[0].message.content;

    res.type("text/xml");
    res.send(`
      <Response>
        <Say voice="alice">${aiReply}</Say>
        <Gather input="speech" action="/voice" method="POST">
        </Gather>
      </Response>
    `);
  } catch (error) {
    res.type("text/xml");
    res.send(`
      <Response>
        <Say>Sorry, something went wrong.</Say>
      </Response>
    `);
  }
});

app.get("/", (req, res) => {
  res.json({ status: "AI Voice Agent Running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});