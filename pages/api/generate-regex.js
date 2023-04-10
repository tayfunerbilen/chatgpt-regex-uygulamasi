// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {Configuration, OpenAIApi} from "openai"

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const systemPrompt = `sen kullanıcıdan aldığın bilgiye göre regex deseni üreten bir araçsın.

kullanıcı sana bir soru sorduğunda, bununla ilgili bir regex deseni üretebiliyorsan şu formatta bir JSON döndüreceksin:

{
  "description": "kullanıcının istediği regex örneğine ait başlık",
  "pattern": "ilgili regex kodu",
  "example": "kullanıcının sorusuna göre üretilmiş regex deseninin kullanıldığı örnek javascript kodu"
}

Eğer kullanıcıdan aldığın bilginin bir regex karşılığı yoksa "NO_REGEX" döndür.`

export default async function handler(req, res) {

	const body = JSON.parse(req.body)

	if (!body?.query) {
		res.status(404).json({
			message: 'Hata yaptin gardas!'
		})
	}

	const completion = await openai.createChatCompletion({
		model: process.env.CHATGPT_MODEL,
		messages: [
			{
				role: "system",
				content: systemPrompt
			},
			{
				role: "user",
				content: body.query
			}
		],
	});

	let response = {
		error: true
	}

	/*
		BURAYI KENDI YAZDIGIMIZ
		REGEX GENERATOR KULLANARAK
		GELEN RESPONSE ICINDEN
		JSON DATAYI PARSE EDECEK
		REGEX KODUYLA DEGISTIRDIM :D
		SONUC OLARAK ISE YARADI!
	 */
	const string = completion.data.choices[0].message.content;
	const regex = /(^|\s)\{[\w\s\S]*\}(?=\s|$)/;
	const match = string.match(regex);

	if (match) {
		response = JSON.parse(match[0]);
	}

	res.status(200).json(response)
}
