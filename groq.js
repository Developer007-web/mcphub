const GROQ_API_KEY = "gsk_Cak7xFStLI8FPtPGHtxYWGdyb3FYLyVW1lweq32SriewOvMxr4UPcrnkringv";

async function askGroq(prompt){

const response = await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${GROQ_API_KEY}`
},
body:JSON.stringify({
model:"llama-3.3-70b-versatile",
messages:[
{
role:"user",
content:prompt
}
]
})
}
);

const data = await response.json();

return data.choices[0].message.content;
}