const http = require("http");
const fs = require("fs");


const PORT=3000;
const  DATA_FILE = "visitors.json";

function readVisitors(){
    if(!fs.existsSync(DATA_FILE)){
        fs.writeFileSync(DATA_FILE,"[]");
    }
    const data = fs.readFileSync(DATA_FILE, "utf8");

    if(data.trim() === ""){
        return [];
    }

    return JSON.parse(data);
}

function saveVisitors(visitors){
    fs.writeFileSync(DATA_FILE, JSON.stringify(visitors,null,4));
}

function generateVisitiorTable(){
    const visitors = readVisitors();

    if(visitors.length === 0){
        return "<h3>No Visitors found</h3>";
    }
    let table = `
    <table>
    <tr>
        <th>ID</th>
        <th>NAME</th>
        <th>COMPANY</th>
        <th>PURPOSE</th>
    </tr>
    `;

    visitors.forEach(visitor => {
        table += `
        

        `;
        
    });
    table += `</table>`;
    return table;
}
const server = http.createServer(function(req,res){
    let filename = '';
    if(req.url === '/'){
        filename = 'index.html';
    }else if(req.url === '/visitor'){

    }

    if(req.method === 'GET' && req.url==='/'){
        fs.readFile("index.html", "utf8", function(err, data){
            const t1 = generateVisitiorTable();

        });
    }
    fs.readFile("index.html", function(err, data){

        res.writeHead(200,{"Content-Type": "text/html"});
        res.write(data);
        res.end();
    });
});
server.listen(3000);
console.log("server running at http://localhost:3000")