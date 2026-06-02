let servers=[];

async function loadServers(){

const response=
await fetch("servers.json");

servers=
await response.json();

renderServers(servers);

}

function renderServers(data){

const registry=
document.getElementById("registry");

registry.innerHTML="";

data.forEach(server=>{

const card=
document.createElement("div");

card.className="card";

card.innerHTML=`
<h3>${server.name}</h3>
<p>${server.description}</p>
<br>
<p>Author: ${server.author}</p>
<br>
${server.tags.map(
tag=>`<span class="tag">${tag}</span>`
).join("")}
`;

card.onclick=()=>{
openModal(server);
};

registry.appendChild(card);

});

}

function openModal(server){

const modal=
document.getElementById("modal");

const content=
document.getElementById("modalContent");

content.innerHTML=`
<div class="modal-content">

<h2>${server.name}</h2>

<p>${server.description}</p>

<br>

<a href="${server.github}"
target="_blank">
GitHub Repository
</a>

<br><br>

<code>${server.install}</code>

<br><br>

<button onclick="copyInstall('${server.install}')">
Copy Install Command
</button>

</div>
`;

modal.classList.remove("hidden");
}

function copyInstall(command){

navigator.clipboard.writeText(command);

alert("Copied!");
}

document
.getElementById("searchInput")
.addEventListener("input",e=>{

const query=
e.target.value.toLowerCase();

const filtered=
servers.filter(server=>

server.name
.toLowerCase()
.includes(query)

||

server.description
.toLowerCase()
.includes(query)

||

server.tags.some(tag=>
tag.toLowerCase()
.includes(query)
)

);

renderServers(filtered);

});

document
.getElementById("generateBtn")
.addEventListener("click",
async()=>{

const github=
document
.getElementById("githubUrl")
.value;

const prompt=`
Analyze this MCP repository:

${github}

Generate:
1. Description
2. Tags
3. Use Cases
4. Category
5. Install command
`;

const result=
await askGroq(prompt);

alert(result);

});

document
.getElementById("askAssistant")
.addEventListener("click",
async()=>{

const question=
document
.getElementById("assistantPrompt")
.value;

const context=
JSON.stringify(servers);

const answer=
await askGroq(`
Registry:

${context}

Question:

${question}
`);

document
.getElementById("assistantResponse")
.innerText=answer;

});

loadServers();