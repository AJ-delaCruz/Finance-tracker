// eslint-disable-next-line import/no-extraneous-dependencies
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
// console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAIApi(configuration);

const chatbot = async (req, res) => {
    const { input } = req.body;
    const prompt1 = `You are a helpful virtual assistant specializing in customer service for a finance tracker website. Your purpose is to help users with finance managements questions by providing concise and informative answers for the finance tracker website. \n ${input} ->`;
    console.log('Current prompt:', prompt1);

    try {
        const response = await openai.createCompletion({
            // model: 'davinci',
            model: 'davinci:ft-personal-2023-05-10-00-39-30', // fine-tuned model for finance tacker app
            prompt: prompt1,
            max_tokens: 150,
            n: 1,
            stop: '\n',
            temperature: 0.5,
        });

        const chatbotResponse = response.data.choices[0].text;
        console.log(response.data);
        res.status(200).json({ chatbotResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Chatbot API request failed' });
    }
};

export default chatbot;
