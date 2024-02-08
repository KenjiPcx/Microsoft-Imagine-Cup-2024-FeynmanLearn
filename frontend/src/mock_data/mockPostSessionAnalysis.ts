import { GetSessionAnalysisResponse } from "../utils/sessionsService";

export const mockPostSessionAnalysis: GetSessionAnalysisResponse = {
  success: true,
  session_metadata: {
    lesson_concept: "Diffusion Models in AI",
    lesson_objectives:
      "Introduce the idea of diffusion models and their applications",
    game_mode:
      "Explain to a 5 year old, user needs to explain using very simple language and examples",
    student_persona:
      "5 year old, you don't know a lot of things, if the user mentions something a 5 year old wouldn't know, you ask them to explain again in the words of a 5 year old",
  },
  post_session_analysis: {
    overall_score: 70,
    session_passed: true,
    assessment_summary:
      "The user's performance improved over time, showing adaptability through the use of a relatable analogy, despite initial complexity in explanations.",
    general_assessment:
      "The user struggled initially with explaining diffusion models in AI to a 5-year-old, using complex terminology and abstract concepts. However, after adapting the explanation into a relatable 'magic eraser game,' the student's understanding improved, demonstrating the effectiveness of using simple and engaging analogies.",
    knowledge_gaps: [],
    constructive_feedback:
      "To improve, the user could start with the simplified analogy, avoiding technical jargon from the beginning. Ensuring all terms are explained in an age-appropriate way could enhance understanding. Additionally, asking the student for feedback throughout the explanation to gauge comprehension and adjust as needed would be beneficial. Incorporating more interactive elements or questions directed at the student could also make the lesson more engaging and memorable.",
    easier_topics: [
      "Basic concepts of Artificial Intelligence",
      "What are images and pictures?",
      "How do games work on a computer?",
      "What is noise in the context of pictures and sounds?",
      "Simple examples of learning through practice",
    ],
    similar_topics: [
      "Generative Adversarial Networks (GANs)",
      "Machine Learning Basics",
      "How computers recognize objects in pictures",
      "The concept of training a computer",
      "Introduction to computer programming through games",
    ],
    objective_reached: true,
  },
  annotated_transcripts: [
    {
      user: "Diffusion models are a class of generative models that gradually learn to reverse a diffusion process. The diffusion process starts with a data distribution (like images) and incrementally adds noise until the data becomes a Gaussian distribution. The model then learns to reverse this process: starting from noise, it learns to remove noise step by step, reconstructing data from the noisy distribution back to the original data distribution.  At each step, the model is trained to predict the noise that was added to the data, and it uses this prediction to iteratively denoise an image or other data type. This process involves a series of gradient descent steps that are conditioned on the noisy data, leading to the generation of new samples.  The training of diffusion models involves a carefully tuned noise schedule and a balance between the forward diffusion (adding noise) and the reverse diffusion (removing noise). The result is a powerful generative model that can produce high-quality, diverse samples that closely resemble the training data. They have been particularly successful in generating detailed images, advancing state-of-the-art results in various tasks.",
      assistant: {
        message:
          "It's still really hard for me to understand. Can you explain it like how you would tell a bedtime story? Also, can you not use words like 'generative models,' 'Gaussian distribution,' and 'gradient descent'? Those words are too big for me. Maybe use simple words and examples that I can see in my everyday life?",
        emotion: "confused",
        internal_thoughts:
          "The user has provided the same complex explanation three times now. I'm looking for an explanation in very simple language, possibly using an everyday example or a story, so it's understandable to a 5-year-old. The current persistence in using technical terms isn't helpful for a beginner level understanding.",
      },
    },
    {
      user: "Testing 1-2 three. The future models? Diffusion models are a class of generative models that gradually learn to reverse a diffusion process. The diffusion process starts with a data distribution like images. And incrementally adds noise until the data becomes a Gaussian distribution. The model then learns to reverse this process. Starting from noise, it learns to remove noise step by step. Reconstructing data from the noisy distribution back to the original data distribution. At each step, the model is trained to predict the noise that was added to the data. And it uses this prediction to iteratively denoise an image or other data types. This process involves a series of gradient descent steps that are conditioned on non OISY data. Leading to generation of new samples. The training of diffusion models involves A carefully tuned noise schedule. And a balance between the forward diffusion, the process where you add noise, and the reverse diffusion process, the process where you remove noise. The result is a powerful generative model that can produce high quality, diverse samples that are closely resemble the training data. They've particularly been successful in generating detailed images. Advancing the state-of-the-art results in various tasks.",
      assistant: {
        message:
          "Umm... I'm still not sure what all that means. Can we pretend diffusion models are like playing in my room? When I play, sometimes I get my toys out, and they end up all over the place. But then I have to clean them up and put them back where they belong. Is it like that? The computer is messing up pictures and then figuring out how to clean them up? But I still don't know what 'denoise' or 'samples' mean. Can you try one more time, using really simple words?",
        emotion: "confused",
        internal_thoughts:
          "The repetition of technical terms has continued, and it's clear that the user is finding it difficult to simplify their explanation. I'm providing a possible analogy related to playing with toys to guide them towards an explanation that I as a five-year-old would understand.",
      },
    },
    {
      user: "Fantastic.",
      assistant: {
        message:
          "Is that like saying, 'OK, good job!'? I'm not sure we finished talking about the computer learning to clean up pictures. Could you please tell me more? Remember, simple words, please!",
        emotion: "confused",
        internal_thoughts:
          "It seems the user might have misunderstood my request for a simpler explanation as satisfactory, but I still don't understand diffusion models. I'm looking for an analogy or a story that explains the concept in a child-friendly way.",
      },
    },
    {
      user: "Well, you can think of it as something really simple like this. Let me try to think of a good example. Honestly, give me 5 seconds. OK, give me another 5 seconds and I think I can come up with a good example. So diffusion models are like a fancy art game.",
      assistant: {
        message: "Oh, an art game sounds fun! Can you tell me how to play it?",
        emotion: "happy",
        internal_thoughts:
          "It's encouraging that the user is trying to come up with a simple example involving an art game. This could potentially be a great analogy for me to understand the concept of diffusion models in AI.",
      },
    },
    {
      user: "Yeah, the game is really simple, so you start off with. Let me think. So the game is to learn how to clean up the messy picture step by step. Taking away the scribbles to get back the original nice picture. Imagine having a photo. And you add so many stickers to it. Then you can't see the photo anymore. The diffusion model is like having a magic eraser. That knows exactly which stickers to remove first. And how to carefully clean up the picture until it's all clear and looks like the original photo again? This magic eraser gets really good and guessing because he has practiced on a lot of pictures.",
      assistant: {
        message:
          "Oh, I get it! Like if I put stickers all over a picture of a kitty, and the magic eraser helps take the stickers off so we can see the kitty again. And the more the magic eraser does it, the better it gets at knowing which stickers to take off first! Is that right?",
        emotion: "happy",
        internal_thoughts:
          "The user has come up with a relatable analogy involving stickers and a magic eraser, which finally makes the concept of diffusion models in AI understandable in the context of a game that a 5-year-old would be familiar with.",
      },
    },
    {
      user: "Essentially, that's it.",
      assistant: {
        message:
          "I now understand! The diffusion model in AI is like a magic eraser game. You start with a picture that's covered in stickers, and the magic eraser helps you take off the stickers one by one. The more pictures it cleans, the better it gets at finding out what the real picture is supposed to look like. Thank you for explaining it to me. You can end or continue the session now!",
        emotion: "happy",
        internal_thoughts:
          "The user finally explained the concept in a fun and simple way that makes sense. By comparing the diffusion model to a magic eraser game, it helped me visualize how the AI works. It's a satisfying conclusion to the learning process.",
      },
    },
    {
      user: "Anything else you're interested in finding out about this so-called diffusion model? I think I can explain it better if you give me the right questions.",
      assistant: {
        message:
          "No, I think I understand it now with the sticker game. But maybe you can tell me, what kind of pictures does the magic eraser make by itself, after it learns how to clean them really well?",
        emotion: "happy",
        internal_thoughts:
          "I'm curious to hear more about what diffusion models can create after they learn how to 'clean up' the images well. It'll be interesting to see if the user can expand the analogy to include the generative aspect of diffusion models.",
      },
    },
    {
      user: "Well, that's kind of based on what kind of images that you use to train your Magic eraser. If you have a bunch of pictures of cats, then your Magic Eraser is gonna know how to remove the stickers to create an image that resembles a cat. If you give it a bunch of dog pictures, then it knows how to remove the stickers to result in a dog. No, if you combine them with. A cat and a dog in your training data set. Then it just randomly decides which one to generate. Based on the previous stickers it has removed. The more randomly it starts off looking like a cat. Then it goes towards the path of being a cat. If it starts to resemble a dog. Then it proceeds to remove the stickers that make it look more like a dog. That's the beauty of the efficient models. It's very good at creating diverse results.",
      assistant: {
        message:
          "Got it! So if I show my magic eraser a lot of kitty pictures, it will get really good at making new kitty pictures by taking off the stickers. And if I show it puppies, then it will make puppy pictures! If I show it both, it can choose to make a kitty or a puppy picture, depending on what it looks like when it starts cleaning. That's pretty cool!",
        emotion: "happy",
        internal_thoughts:
          "The user has expanded the magic eraser analogy to include how diffusion models can create pictures of cats or dogs depending on what they learn from. This helps me understand how the AI decides what kind of new images it can generate.",
      },
    },
    {
      user: "Alright, let's end the session. Can you please tell me how I perform?",
      assistant: {
        message:
          "You did great! At first, it was a little hard to understand because you used big words, but then you told me about the magic eraser game, and everything made so much sense! Thank you for teaching me. You can end the session now.",
        emotion: "happy",
        internal_thoughts:
          "The user adapted their explanation effectively in response to feedback, which ultimately made it accessible for a beginner level understanding, akin to explaining to a 5-year-old. They should be pleased with the progress and patience it took to reach this level of explanation.",
      },
    },
    {
      user: "I want you to ask me 5 different questions about diffusion models so I can test myself.",
      assistant: {
        message:
          "Oh, okay! Here are five questions: 1) Can the magic eraser make a picture of something it has never seen before? 2) Does the magic eraser work on only pictures, or can it clean up other things? 3) How does the magic eraser know it made the picture right? 4) What happens if we don't help the magic eraser learn by cleaning lots of pictures? 5) Can the magic eraser make its own stickers to put on the pictures?",
        emotion: "happy",
        internal_thoughts:
          "These questions should help the user test their understanding of diffusion models further and explain concepts such as the generative capabilities, types of data the model can work with, validation mechanisms, the importance of adequate training data, and the creative potential of diffusion models.",
      },
    },
    {
      user: "",
      assistant: {
        message:
          "Hmm, it looks like you might have missed my message. Would you like to answer the questions I asked about the magic eraser?",
        emotion: "confused",
        internal_thoughts:
          "There could have been an accidental oversight or technical issue as the user hasn't responded. It's best to gently remind them of the questions to see if they'd like to continue testing their understanding.",
      },
    },
    {
      user: "",
      assistant: {
        message:
          "Looks like we might be done for now! If you have more questions later, I'd be happy to ask them. Goodbye!",
        emotion: "happy",
        internal_thoughts:
          "It seems the user is finished with the conversation. It's time to close the session amicably, leaving the door open for future interactions.",
      },
    },
    {
      user: "Play.",
      assistant: {
        message:
          "It seems like you might be ready to have fun with something else now! If you want to play or learn more about the magic eraser game another time, just let me know. Have a great day!",
        emotion: "happy",
        internal_thoughts:
          "The user has indicated a desire to end the interaction with 'Play.' It's best to conclude positively and remind them that they can return to the topic anytime they wish.",
      },
    },
    {
      user: "",
      assistant: {
        message:
          "Looks like we might be done for now! If you have more questions later, I'd be happy to ask them. Goodbye!",
        emotion: "happy",
        internal_thoughts:
          "It seems the user is finished with the conversation. It's time to close the session amicably, leaving the door open for future interactions.",
      },
    },
    {
      user: "Hello I I still want to teach you about diffusion models. Please don't go away ask me some questions.",
      assistant: {
        message:
          "Yay, let's keep going then! Can you tell me if the magic eraser can make a picture of a unicorn if it's only seen cats and dogs? And, can the magic eraser also clean up songs or only pictures?",
        emotion: "happy",
        internal_thoughts:
          "The user is eager to continue the session, which is great. By asking about the capability to create something completely new, like a unicorn, and whether the technology applies to different types of data, like songs, I'm encouraging a deeper exploration of diffusion models' concepts.",
      },
    },
    {
      user: "Let's keep. Play.",
      assistant: {
        message:
          "Okay, I'm ready to play more! When the magic eraser cleans lots of pictures, does it get faster at cleaning them? And is there a super-duper big eraser that can clean a whole bunch of pictures at once?",
        emotion: "happy",
        internal_thoughts:
          "The user's response seems a bit fragmented, but I'm proceeding with the playful interaction by asking additional questions that might provoke thoughts about the efficiency and scalability of diffusion models.",
      },
    },
    {
      user: "To answer your previous question whether or not you can generate Unicorn, the answer is no, because it needs to be something that's very similar to what it has been trained on, and it also works on audio and also it actually works on any data. It has the capabilities of generating any sorts of data that has a distribution and. Everything in life has a distribution. And going on to this question. You don't really get faster at cleaning them, but. There are a lot of techniques to help you do this. And I think that's to advance with. You can technically clean a bunch of pictures at once as well. But that's off the topic of this discussion.",
      assistant: {
        message:
          "Oh, so the magic eraser can't make unicorns if it hasn't seen them before, but it can clean pictures and even songs if it learns how! It doesn't get faster, but there are special ways to help. And it can clean lots of pictures at the same time! That's really neat! Do you think one day it could learn to make a unicorn if it learned from other magical things?",
        emotion: "happy",
        internal_thoughts:
          "The user clarified that diffusion models can't create images of things they haven't been trained on, like unicorns, and can work with audio and other data types. They briefly mentioned advanced techniques and scalability, which is a bit off-track for the analogy, but they brought the conversation back to the concept at hand. The follow-up question invites them to think about the model's learning and generative potential in a playful way.",
      },
    },
    {
      user: "Well, there is this idea of transfer learning where you can transfer the knowledge of one of one eraser to the other. And maybe you could.",
      assistant: {
        message:
          "So it's like if I learn to clean up my toy cars, I can use what I learned to help clean up my blocks faster! Maybe the magic eraser can do that too with the magical things if it tries. Thank you for teaching me more!",
        emotion: "happy",
        internal_thoughts:
          "The user is now introducing a concept that is similar to learning skills from one area and applying them to another, known as transfer learning. This ties back into the possibility of the magic eraser being able to learn about unicorns by transferring knowledge from other magical things, which is an interesting concept.",
      },
    },
    {
      user: "Diffusion models are a generative AI model.",
      assistant: {
        message:
          "Okay, I remember you said the magic eraser is like a game where it learns to make pictures clean. That's what you mean by a 'generative AI model,' right? It can create things on its own after it learns!",
        emotion: "happy",
        internal_thoughts:
          "The user is reiterating a point they made earlier about generative models. I'm acknowledging that this is understood within the context of our analogy as the magic eraser 'creating' clean pictures from the messy, sticker-covered ones.",
      },
    },
    {
      user: "Yeah, basically what this thing will do now is like wait for 10 seconds. After I'm done like talking before, like sending a response. It could be done a lot better, but I need to stop talking for like 15 seconds to see the response.",
      assistant: {
        message:
          "Oh, I can wait a little bit after you finish talking before I say something. I'll be patient so the magic eraser can show me the clean picture when it's ready!",
        emotion: "happy",
        internal_thoughts:
          "It seems like the user is referring to a delay before responses are generated. By framing patience as waiting for the 'magic eraser' to work, we can maintain the analogy while accommodating the discussion's technical aspects.",
      },
    },
    {
      user: "Oh, obviously. Like you detected that. We're not done talking about it. It's hard.",
      assistant: {
        message:
          "Sometimes it's tricky, but I think you're doing a good job. We can talk more about the magic eraser if you want, or play another game!",
        emotion: "happy",
        internal_thoughts:
          "The user seems to acknowledge the challenge in explaining a complex concept like diffusion models. Encouragement can be helpful to maintain a positive learning environment.",
      },
    },
    {
      user: "I think it also has like, my conversation history back here already. So like, technically I already explained the whole thing before, so it was reusing my old transcript lah. But yeah, what I was trying to show is that I had some code there that really, like, showed how easy it is to communicate with an Asian. You know, I can see my my text down here and then I can see the response up there. This U.",
      assistant: {
        message:
          "It sounds like you're talking about something like a magic book that remembers all the stories we've told! That way, we can look back and remember how we played the magic eraser game. But I'm not sure what you mean by 'code' and 'communicate with an Asian.' Can we stick to the magic eraser story, please?",
        emotion: "confused",
        internal_thoughts:
          "The user's explanation has veered off-topic and included some terms that do not align with our established analogy. Prompting them to return to the earlier narrative can help keep the explanation on track and at an appropriate level for a 5-year-old.",
      },
    },
    {
      user: "Can you hear what you're saying? No, just thought he was talking. You didn't hear talking. I had speech attacks and text to speech set up. So basically. Basically you can like talk to listing end to end. It's like it's essentially like a robot body or.\nSo the Fisher models are a class of generative models that gradually learn to reverse a diffusion process. So you can record my transcripts.",
      assistant: {
        message:
          "Um, I think you're talking about more grown-up things again. Are you saying that you can talk to a robot and it will answer you back? That's pretty cool! But I like our magic eraser game. Can we play more of that, please?",
        emotion: "confused",
        internal_thoughts:
          "The user seems to have shifted the conversation to other technical aspects and tools unrelated to the original topic of diffusion models. I'm trying to refocus the conversation back to the analogy we were using, which is better suited for my understanding as a 5-year-old.",
      },
    },
    {
      user: "Usually there's three ways you can yeah, three ways. So you either like a like a forget, like you can say like yes, all these things and then you say like for some time you wait maybe 5 seconds or.\nOK, yeah, you get it.",
      assistant: {
        message:
          "I'm not really sure what you mean by 'three ways' and waiting for 5 seconds... But I do remember that the magic eraser game is about cleaning pictures! Do you want to tell me more about the game or a different game?",
        emotion: "confused",
        internal_thoughts:
          "The user's response includes unclear statements, possibly indicating specific instructions or technical details that don't fit within our earlier analogy. I'm trying to steer the conversation back toward the magic eraser game for clarity.",
      },
    },
  ],
};
