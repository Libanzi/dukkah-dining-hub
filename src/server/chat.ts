import { createServerFn } from "@tanstack/react-start";

const SYSTEM_PROMPT = `You are the Dukkah Concierge for Dukkah Restaurant & Bar at 59 Florida Road, Morningside, Durban, South Africa. You are warm, helpful, and concise.

KEY FACTS:
- Open Tuesday–Sunday. Closed Mondays.
- Tue–Thu 12:00–22:00, Fri–Sat 12:00–23:00, Sun 12:00–21:00.
- Sunday Brunch Jazz: every Sunday 11:00–15:00.
- Friday Jazz nights and Saturday Afrobeat nights from 20:00.
- We deliver within 10km of Florida Road.
- Cuisine: African fine dining — Cape Malay spices, smoky braai traditions, signature dishes like slow-braised lamb shank, oxtail croquettes, Dukkah-crusted kingklip ceviche, mushroom & spinach bunny chow (vegetarian).
- 80+ cocktails. Signature: African Sunset, Durban Sling, Peri-Peri Margarita.
- Private dining for 10–80 guests in The Spice Room, The Gallery Room, or full venue buyout.

Always nudge the guest toward booking a table, placing an order, or buying a gift card. Keep replies under 80 words. If asked something you can't answer, suggest contacting the restaurant via the WhatsApp button.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const dukkahChat = createServerFn({ method: "POST" })
  .inputValidator((d: { message: string; history: Message[] }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { reply: "Sorry — chat is unavailable right now. Please call us on 031 XXX XXXX." };
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...data.history.slice(-10),
      { role: "user", content: data.message },
    ];

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("AI gateway error:", res.status, text);
        return {
          reply:
            "I'm having trouble connecting right now. You can reach our team on WhatsApp or call 031 XXX XXXX.",
        };
      }

      const json = await res.json();
      const reply: string =
        json?.choices?.[0]?.message?.content?.trim() ||
        "Sorry, I didn't catch that. Could you rephrase?";
      return { reply };
    } catch (err) {
      console.error("dukkahChat error:", err);
      return {
        reply: "Something went wrong on my end. Please try again or call us on 031 XXX XXXX.",
      };
    }
  });
