// /pages/api/send-meme.ts
import type { NextApiRequest, NextApiResponse } from "next"

export const config = {
  api: {
    bodyParser: true, // pour autoriser les buffers encodés en base64
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed")

  const { buffer, topText, author } = req.body

  if (!buffer || !topText) {
    return res.status(400).json({ error: "buffer et topText sont requis" })
  }

  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) throw new Error("DISCORD_WEBHOOK_URL manquant dans .env")

    const imageBuffer = Buffer.from(buffer, "base64")

    const form = new FormData()
    form.append("file", new Blob([imageBuffer]), "meme.png")
    form.append("content", `🎉 **${topText}**${author ? `\n_${author}_` : ""}`)

    const response = await fetch(webhookUrl, {
      method: "POST",
      body: form,
    })

    if (!response.ok) {
      console.error("Discord webhook échec:", await response.text())
      throw new Error("Échec d'envoi du mème")
    }

    return res.status(200).json({ success: true })
  } catch (err: any) {
    console.error("Erreur API Discord:", err)
    return res.status(500).json({ error: err.message || "Erreur inconnue" })
  }
}
