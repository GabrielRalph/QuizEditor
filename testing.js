import {SvgPlus} from "./SvgPlus/4.js"
import {WBInputs} from "./Utilities/shared.js";
import {QuizEditor} from "./QuizEditor/quiz-editor.js";
import {QuizView} from "./QuizEditor/quiz.js";
import {getEmptyAnswer, getEmptyQuestion, getEmptyQuiz} from "./Firebase/quizzes.js";
import { QuizResultsPage } from "./QuizEditor/quiz-results.js";
import { initialise } from "./Firebase/firebase-client.js";

const testQ = {
    "name": "New Quiz",
    "public": false,
    "n_questions": 4,
    "questions": [
        {
            "question": "What is your favorite fruit and vegitable and What is your favorite fruit and vegitable?",
            "n_answers": 5,
            "answers": [
                {
                    "title": "A",
                    "subtitle": "some text here",
                    "correct": false,
                    "image": ""
                },
                {
                    "title": "Apple",
                    "subtitle": "some more",
                    "correct": false,
                    "image": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Fall%2FvEC6TVbDrbeIJERoN93X?alt=media&token=c3baa059-fea7-46be-ae6d-88126b916d6c"
                },
                {
                    "title": "Orange",
                    "subtitle": "",
                    "correct": true,
                    "image": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Fall%2Fwn5NvMHvy2AykaFffOar?alt=media&token=f33ea808-df91-44da-8d45-9644c71cd5f7"
                },
                {
                    "title": "Grape",
                    "subtitle": "",
                    "correct": false,
                    "image": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Fall%2FVFMr6CKdGWhXVJSMMIZG?alt=media&token=d64d14a4-fb9a-447f-be71-a6b4eb9efa48"
                },
                {
                    "title": "Watermelon",
                    "subtitle": "",
                    "correct": false,
                    "image": "https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Fall%2FRRnu7hOmC3SrTCmVfgtf?alt=media&token=f763964d-df8c-4cec-9411-9be42c7aaf64"
                }
            ]
        },
        {
            "question": "Question 2",
            "n_answers": 4,
            "answers": [
                {
                    "title": "A",
                    "subtitle": "",
                    "correct": false,
                    "image": ""
                },
                {
                    "title": "B",
                    "subtitle": "",
                    "correct": true,
                    "image": ""
                },
                {
                    "title": "C",
                    "subtitle": "",
                    "correct": false,
                    "image": ""
                },
                {
                    "title": "D",
                    "subtitle": "",
                    "correct": false,
                    "image": ""
                }
            ]
        },
        {
            "question": "Question 3",
            "n_answers": 4,
            "answers": [
                {
                    "title": "A",
                    "subtitle": "",
                    "correct": true,
                    "image": ""
                },
                {
                    "title": "B",
                    "subtitle": "",
                    "correct": true,
                    "image": ""
                },
                {
                    "title": "C",
                    "subtitle": "",
                    "correct": false,
                    "image": ""
                },
                {
                    "title": "D",
                    "subtitle": "",
                    "correct": false,
                    "image": ""
                }
            ]
        },
        {
            "question": "Question 4",
            "n_answers": 4,
            "answers": [
                {
                    "title": "A",
                    "subtitle": "",
                    "correct": false,
                    "image": ""
                },
                {
                    "title": "B",
                    "subtitle": "",
                    "correct": false,
                    "image": ""
                },
                {
                    "title": "C",
                    "subtitle": "",
                    "correct": false,
                    "image": ""
                },
                {
                    "title": "D",
                    "subtitle": "",
                    "correct": true,
                    "image": ""
                }
            ]
        }
    ]
}
const test_sub = {"name":"my favourite ","public":false,"n_questions":"3","questions":[{"question":"what is my favourite colour","n_answers":4,"image":null,"answers":[{"title":"black ","subtitle":"","correct":false,"image":"https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Fall%2FgizvReUsiTxoJh7uTkAP?alt=media&token=72659569-f26c-4040-8439-8bd79a246ce3","color":"white"},{"title":"green ","subtitle":"","correct":true,"image":"","color":"dark-green"},{"title":"blue ","subtitle":"","correct":false,"image":"","color":"dark-indigo"},{"title":"white ","subtitle":"","correct":false,"image":"","color":"white"}]},{"question":"do i like lemon ","n_answers":2,"image":null,"answers":[{"title":"o","subtitle":"","correct":true,"image":"","color":"white"},{"title":"x","subtitle":"","correct":false,"image":"","color":"white"}]},{"question":"my fav part","n_answers":6,"image":null,"answers":[{"title":"hair ","subtitle":"","correct":false,"image":"","color":"white"},{"title":"shoulder ","subtitle":"","correct":false,"image":"","color":"white"},{"title":"ass","subtitle":"","correct":false,"image":"","color":"white"},{"title":"balls","subtitle":"","correct":true,"image":"","color":"white"},{"title":"dick","subtitle":"","correct":false,"image":"","color":"white"},{"title":"boobs","subtitle":"","correct":false,"image":"","color":"white"}]}]}
const Res = {
	"actions": [
		
       
		{
			"type": "answer",
			"duration": 2489.5,
			"answer": [
				0
			],
			"question": 2
		},
		{
			"type": "answer",
			"duration": 709.9000000357628,
			"answer": [
				0,
				1
			],
			"question": 2
		},
		{
			"type": "answer",
			"duration": 1132.5999999642372,
			"answer": [
				0,
				1,
				2
			],
			"question": 2
		},
		{
			"type": "next",
			"duration": 910.1999999880791,
			"answer": [
				0,
				1,
				2
			],
			"question": 2
		},
		{
			"type": "answer",
			"duration": 3358.800000011921,
			"answer": [
				3
			],
			"question": 3
		},
		{
			"type": "back",
			"duration": 848.5,
			"answer": [
				3
			],
			"question": 3
		},
        {
			"type": "answer",
			"duration": 5802.800000011921,
			"answer": [
				3
			],
			"question": 0
		},
		{
			"type": "next",
			"duration": 943.7999999523163,
			"answer": [
				3
			],
			"question": 0
		},
		{
			"type": "answer",
			"duration": 2312,
			"answer": [
				1
			],
			"question": 1
		},
		{
			"type": "next",
			"duration": 660.8000000119209,
			"answer": [
				1
			],
			"question": 1
		},
		{
			"type": "answer",
			"duration": 2489.5,
			"answer": [
				0
			],
			"question": 2
		},
		{
			"type": "answer",
			"duration": 709.9000000357628,
			"answer": [
				0,
				1
			],
			"question": 2
		},
		{
			"type": "answer",
			"duration": 1132.5999999642372,
			"answer": [
				0,
				1,
				2
			],
			"question": 2
		},
		{
			"type": "next",
			"duration": 910.1999999880791,
			"answer": [
				0,
				1,
				2
			],
			"question": 2
		},
		{
			"type": "answer",
			"duration": 3358.800000011921,
			"answer": [
				3
			],
			"question": 3
		},
		{
			"type": "back",
			"duration": 848.5,
			"answer": [
				3
			],
			"question": 3
		},
		{
			"type": "back",
			"duration": 323.4000000357628,
			"answer": [
				0,
				1,
				2
			],
			"question": 2
		},
		{
			"type": "back",
			"duration": 420.60000002384186,
			"answer": [
				1
			],
			"question": 1
		},
		{
			"type": "back",
			"duration": 221.0999999642372,
			"answer": [
				3
			],
			"question": 0
		},
		{
			"type": "answer",
			"duration": 956.6000000238419,
			"answer": [
				2
			],
			"question": 0
		},
		{
			"type": "next",
			"duration": 1005.5,
			"answer": [
				2
			],
			"question": 0
		},
		{
			"type": "next",
			"duration": 179.89999997615814,
			"answer": [
				1
			],
			"question": 1
		},
		{
			"type": "next",
			"duration": 166.30000001192093,
			"answer": [
				0,
				1,
				2
			],
			"question": 2
		},
		{
			"type": "next",
			"duration": 340.7000000476837,
			"answer": [
				3
			],
			"question": 3
		}
	],
	"answers": [
		{
			"choosen": [
				2
			],
			"question": 0,
			"correct": [
				2
			]
		},
		{
			"choosen": [
				1
			],
			"question": 1,
			"correct": [
				1
			]
		},
		{
			"choosen": [
				0,
				1,
				2
			],
			"question": 2,
			"correct": [
				0,
				1
			]
		},
		{
			"choosen": [
				3
			],
			"question": 3,
			"correct": [
				3
			]
		}
	],
	"csv": "**Quiz Actions**\nquestion,action,response time (s), selected answers\nQ1, answer, 5.8s, [3]\nQ1, next, 0.94s, [3]\nQ2, answer, 2.31s, [1]\nQ2, next, 0.66s, [1]\nQ3, answer, 2.49s, [0]\nQ3, answer, 0.71s, [0,1]\nQ3, answer, 1.13s, [0,1,2]\nQ3, next, 0.91s, [0,1,2]\nQ4, answer, 3.36s, [3]\nQ4, back, 0.85s, [3]\nQ3, back, 0.32s, [0,1,2]\nQ2, back, 0.42s, [1]\nQ1, back, 0.22s, [3]\nQ1, answer, 0.96s, [2]\nQ1, next, 1.01s, [2]\nQ2, next, 0.18s, [1]\nQ3, next, 0.17s, [0,1,2]\nQ4, next, 0.34s, [3]\n\n**Quiz Results\nquestion, correct, choosen\nQ1, [2], [2]\nQ2, [1], [1]\nQ3, [0,1], [0,1,2]\nQ4, [3], [3]",
	"summary": "### Overall Performance Insights:\n1. **Correct Answers**: The participant answered Q1, Q2, and Q4 correctly, but struggled with Q3, selecting multiple incorrect options alongside the correct ones.\n2. **Response Times**: The response times varied significantly across questions. Q1 had the longest initial answer time (5.8s), while subsequent answers were generally quicker, indicating a learning curve or adjustment to the quiz format.\n\n### Response Times Analysis:\n- **Q1**: The initial answer took 5.8 seconds, which is relatively long, suggesting the participant may have been unsure or needed more time to think.\n- **Q2**: The response time decreased to 2.31 seconds, indicating improved confidence or familiarity with the question format.\n- **Q3**: The participant took a total of 4.33 seconds to answer (including multiple attempts), which suggests confusion or difficulty in understanding the question.\n- **Q4**: The response time was 3.36 seconds, showing a moderate level of engagement but still quicker than Q1.\n\n### Conclusions:\n- The participant demonstrated a learning curve, with response times decreasing as they progressed through the quiz, except for Q3 where confusion led to multiple attempts.\n- The correct answers indicate a good grasp of the material, but the incorrect selections in Q3 suggest a need for clearer understanding or instruction on that topic.\n- Overall, the participant's performance shows potential but highlights areas for improvement, particularly in handling complex questions."
}
const test_gab = {"name":"Do you know me?","public":false,"n_questions":"3","questions":[{"question":"What is my favourite?","n_answers":4,"image":null,"answers":[{"title":"Boobs","subtitle":"","correct":true,"image":"https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Fall%2FRPDI3BxYlMzt44M3Dnnu?alt=media&token=424ebd50-838d-4cfb-ad92-3663abd040f9","color":"dark-red"},{"title":"Bum","subtitle":"","correct":true,"image":"https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Fall%2F1rnHVl3Sp82VDnZ6Attb?alt=media&token=738474fd-2793-48f3-bac0-c9f3b7175238","color":"dark-orange"},{"title":"Pussy","subtitle":"","correct":true,"image":"https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Fall%2FH2LWbl9KmFZqZ3nPkzTK?alt=media&token=55878883-4e08-4248-a80f-19c7778542ae","color":"dark-teal"},{"title":"Stomach","subtitle":"","correct":true,"image":"https://firebasestorage.googleapis.com/v0/b/eyesee-d0a42.appspot.com/o/icons%2Fall%2FsjJGWRZ1FZl3me71G4hY?alt=media&token=a87bf1ae-56be-495a-8885-b88e824ac8c2","color":"dark-indigo"}]},{"question":"What is this?","n_answers":4,"image":"https://atlas-content-cdn.pixelsquid.com/stock-images/green-led-diode-72wy3G7-600.jpg","answers":[{"title":"Light Bulb","subtitle":"","correct":false,"image":"","color":"light-red"},{"title":"Light Emitting Diode","subtitle":"","correct":true,"image":null,"color":"light-orange"},{"title":"But Plug","subtitle":"","correct":false,"image":"","color":"light-green"},{"title":"Jewellery ","subtitle":"","correct":false,"image":"","color":"light-blue"}]},{"question":"Which is my **fav** hold?","n_answers":4,"image":null,"answers":[{"title":"Crimp","subtitle":"","correct":false,"image":"https://boulderflash.com/wp-content/uploads/2023/11/DSC7653-Enhanced-NR-1-1024x683.jpg","color":"white"},{"title":"Sloper","subtitle":"","correct":false,"image":"https://blog.movementgyms.com/hs-fs/hubfs/EL%20CAP%20Slopers%20Blog_full%20hand%20sloper%20092321.jpg?width=700&name=EL%20CAP%20Slopers%20Blog_full%20hand%20sloper%20092321.jpg","color":"white"},{"title":"Pinch","subtitle":"","correct":true,"image":"https://static.wixstatic.com/media/003ebe_418dcfcb31bb4375b5c4312f1922c0b4~mv2.jpeg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/003ebe_418dcfcb31bb4375b5c4312f1922c0b4~mv2.jpeg","color":"white"},{"title":"Jug","subtitle":"","correct":false,"image":"https://images.squarespace-cdn.com/content/v1/59e802b9be42d61a159cbf16/1688970133176-XVNTPDSJ9JE0Q5QLIHO4/PXL_20230710_031831774.MP.jpg","color":"white"}]}]};
const RES2 = {"actions":[{"type":"answer","duration":4840.70000000298,"answer":[0],"question":0},{"type":"next","duration":2532.699999999255,"answer":[0],"question":0},{"type":"answer","duration":12250.5,"answer":[0],"question":1},{"type":"next","duration":2574.300000000745,"answer":[0],"question":1},{"type":"answer","duration":6904.300000000745,"answer":[4],"question":2},{"type":"answer","duration":335.19999999925494,"answer":[1],"question":2},{"type":"answer","duration":923.6999999992549,"answer":[4],"question":2},{"type":"answer","duration":670.3000000007451,"answer":[5],"question":2},{"type":"answer","duration":801.6999999992549,"answer":[2],"question":2},{"type":"answer","duration":16440.300000000745,"answer":[5],"question":2},{"type":"answer","duration":2902.199999999255,"answer":[2],"question":2},{"type":"next","duration":1470.8999999985099,"answer":[2],"question":2}],"answers":[{"choosen":[0],"question":0,"correct":[1]},{"choosen":[0],"question":1,"correct":[0]},{"choosen":[2],"question":2,"correct":[3]}],"csv":"**Quiz Actions**\nquestion,action,response time (s), selected answers\nQ1, answer, 4.84s, [0]\nQ1, next, 2.53s, [0]\nQ2, answer, 12.25s, [0]\nQ2, next, 2.57s, [0]\nQ3, answer, 6.9s, [4]\nQ3, answer, 0.34s, [1]\nQ3, answer, 0.92s, [4]\nQ3, answer, 0.67s, [5]\nQ3, answer, 0.8s, [2]\nQ3, answer, 16.44s, [5]\nQ3, answer, 2.9s, [2]\nQ3, next, 1.47s, [2]\n\n**Quiz Results\nquestion, correct, choosen\nQ1, [1], [0]\nQ2, [0], [0]\nQ3, [3], [2]","summary":"Based on the quiz data results, here are some insights regarding overall performance, response times, and conclusions:\n\n### Overall Performance:\n- The participant answered Q1 incorrectly, Q2 incorrectly, and Q3 partially correctly (2 out of 3 correct answers).\n- The participant struggled with Q2, as they did not select any correct answers.\n\n### Response Times:\n- The response times for Q1 and Q2 were relatively moderate, with Q1 taking 4.84 seconds and Q2 taking 12.25 seconds. The longer time on Q2 suggests difficulty in understanding or processing the question.\n- For Q3, the participant exhibited a mix of quick and slow response times. The initial answer took 6.9 seconds, but subsequent answers were much quicker, with several responses under 1 second. This indicates uncertainty or indecision, followed by a rapid selection process once they settled on an answer.\n- The total time spent on Q3 (including multiple answers) was significant, with the longest single response taking 16.44 seconds, indicating a challenging question.\n\n### Conclusions:\n- The participant may need to improve their understanding of the material related to Q2, as they did not select any correct answers.\n- The varied response times in Q3 suggest that the participant was trying to evaluate multiple options before arriving at a final answer, which could indicate confusion or a lack of confidence in their knowledge.\n- Overall, the participant demonstrated some knowledge but struggled with certain questions, particularly Q2. Focused review and practice on the topics covered in Q2 and Q3 could enhance performance in future quizzes."}
const RES3 = {"actions":[{"type":"answer","duration":3071.699999999255,"answer":[2],"question":0},{"type":"answer","duration":1854.9000000022352,"answer":[2,1],"question":0},{"type":"answer","duration":1266.7999999970198,"answer":[2,1,0],"question":0},{"type":"answer","duration":5517.900000002235,"answer":[2,1,0,3],"question":0},{"type":"answer","duration":12365.300000000745,"answer":[2,1,0],"question":0},{"type":"answer","duration":817.6999999992549,"answer":[2,1],"question":0},{"type":"next","duration":8093.300000000745,"answer":[2,1],"question":0},{"type":"answer","duration":10873.900000002235,"answer":[1],"question":1},{"type":"next","duration":2027.8999999985099,"answer":[1],"question":1},{"type":"answer","duration":17097.800000000745,"answer":[2],"question":2},{"type":"next","duration":964.4000000022352,"answer":[2],"question":2}],"answers":[{"choosen":[2,1],"question":0,"correct":[0,1,2,3]},{"choosen":[1],"question":1,"correct":[1]},{"choosen":[2],"question":2,"correct":[2]}],"csv":"**Quiz Actions**\nquestion,action,response time (s), selected answers\nQ1, answer, 3.07s, [2]\nQ1, answer, 1.85s, [2,1]\nQ1, answer, 1.27s, [2,1,0]\nQ1, answer, 5.52s, [2,1,0,3]\nQ1, answer, 12.37s, [2,1,0]\nQ1, answer, 0.82s, [2,1]\nQ1, next, 8.09s, [2,1]\nQ2, answer, 10.87s, [1]\nQ2, next, 2.03s, [1]\nQ3, answer, 17.1s, [2]\nQ3, next, 0.96s, [2]\n\n**Quiz Results\nquestion, correct, choosen\nQ1, [0,1,2,3], [2,1]\nQ2, [1], [1]\nQ3, [2], [2]","summary":"### Insights into Quiz Performance and Response Times\n\n1. **Overall Performance**:\n   - The quiz consists of three questions (Q1, Q2, Q3).\n   - The participant answered Q1 incorrectly, selecting options [2,1] instead of the correct answers [0,1,2,3].\n   - Q2 was answered correctly with the selection [1].\n   - Q3 was also answered correctly with the selection [2].\n   - Overall, the participant scored 2 out of 3, indicating a good understanding of the material but with some confusion on Q1.\n\n2. **Response Times**:\n   - The response times for Q1 varied significantly, with the longest being 12.37 seconds and the shortest being 0.82 seconds. This suggests that the participant struggled with Q1, as evidenced by the longer times spent on answering.\n   - The time taken to answer Q2 (10.87 seconds) was also relatively long, indicating that the participant may have been uncertain about the correct answer.\n   - Q3 had the shortest response time for answering (17.1 seconds), which could indicate either confidence in the answer or a straightforward question.\n   - The \"next\" actions for Q1 and Q2 were relatively quick (8.09s and 2.03s respectively), suggesting that the participant was ready to move on after answering, despite the longer times taken to answer.\n\n3. **Conclusions**:\n   - The participant demonstrated a solid grasp of the material overall, but the incorrect response to Q1 indicates a need for review of that specific content area.\n   - The varying response times suggest that the participant may benefit from strategies to improve decision-making speed, particularly for questions that require multiple selections.\n   - The quick transition to the next question after answering suggests a willingness to progress, which is positive, but it may also indicate a lack of thorough review of answers before submission.\n   - Future quizzes could focus on reinforcing the concepts related to Q1 to enhance understanding and accuracy."};
let tq = getEmptyQuiz();
let test= new SvgPlus("test");
await initialise();


let testquiz = testQ;
let results = Res;
let mode = "create"
switch (mode) {
	case "create":
		let quizEd = test.createChild(QuizEditor, {});
		quizEd.initialise();
		break;

	case "test":
		let qv = test.createChild(QuizView);
		qv.loadAndStartQuiz(testquiz);
		break;
	
	case "results":
		let qr = test.createChild(QuizResultsPage, {}, testquiz, results);
		break
}
