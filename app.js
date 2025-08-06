import express from "express";
import dotenv from "dotenv";
import axios from "axios";


/* import OpenAI from "openai"; */

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ruta para generar imagenes con ia 

app.post("/api/gen-img", async (req, res) => {

  const apiKey = process.env.OPENAI_API_KEY;

  const { category } = req.body;


  let myPrompt = `
   Eres un diseñador gráfico experto 
   tu objetivo final es crear un avatar para un ${category}
   expecificaiones del avatar:
   -Estilo: anime (tipo dibujos animados de anima/manga)
   -Dimensiones: 256x256 pixeles
   -Fondo de la imagen: Color sólido
   -Protagonista del avatar de ser: ${category}.
   -Formato de la imagen: sera siempre cuadrado a rectangular.
  `;


  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-2",
        prompt: myPrompt,
        n: 1,
        size: "256x256"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        }
      }
    );


    const imageUrl = response.data.data[0].url;

    return res.json({image_url: imageUrl})



  } catch (error) {
    console.log("Error al generar la imagen", error);
    return res.status(500).json({ error: "Errror al generar el avatar" })

  }


});



app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT} 🚀`);
});
