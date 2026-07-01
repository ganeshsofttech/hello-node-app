const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

const PORT = 3000;
const DATA_FILE = "visitors.json";

// Read Visitors
function readVisitors() {

   if (!fs.existsSync(DATA_FILE)) {
       fs.writeFileSync(DATA_FILE, "[]");
   }

   const data = fs.readFileSync(DATA_FILE, "utf8");

   if (data.trim() === "") {
       return [];
   }

   return JSON.parse(data);
}

// Save Visitors
function saveVisitors(visitors) {

   fs.writeFileSync(DATA_FILE, JSON.stringify(visitors, null, 4));

}

// Generate Visitor Table
function generateVisitorTable() {

   const visitors = readVisitors();

   if (visitors.length === 0) {

       return "<h3>No Visitors Found</h3>";

   }

   let table = `
   <table>
   <tr>
       <th>ID</th>
       <th>Name</th>
       <th>Company</th>
       <th>Purpose</th>
       <th>Host</th>
       <th>Status</th>
       <th>Action</th>
   </tr>
   `;

   visitors.forEach(visitor => {

       table += `
       <tr>

           <td>${visitor.id}</td>

           <td>${visitor.name}</td>

           <td>${visitor.company}</td>

           <td>${visitor.purpose}</td>

           <td>${visitor.host}</td>

           <td>${visitor.status}</td>

           <td>

           <a href="/checkout?id=${visitor.id}">
           Check Out
           </a>

           |

           <a href="/delete?id=${visitor.id}">
           Delete
           </a>

           </td>

       </tr>
       `;

   });

   table += "</table>";

   return table;

}

const server = http.createServer((req, res) => {

   // HOME PAGE
   if (req.method === "GET" && req.url === "/") {

       fs.readFile("index.html", "utf8", (err, html) => {

           const table = generateVisitorTable();

           html = html.replace("{{VISITORS}}", table);

           res.writeHead(200, {
               "Content-Type": "text/html"
           });

           res.end(html);

       });

   }

   // ADD VISITOR PAGE
   else if (req.method === "GET" && req.url === "/visitor") {

       fs.readFile("visitor.html", (err, data) => {

           res.writeHead(200, {
               "Content-Type": "text/html"
           });

           res.end(data);

       });

   }

   // SAVE VISITOR
   else if (req.method === "POST" && req.url === "/savevisitor") {

       let body = "";

       req.on("data", chunk => {

           body += chunk;

       });

       req.on("end", () => {

           const form = querystring.parse(body);

           const visitors = readVisitors();

           const visitor = {

               id: Date.now(),

               name: form.name,

               company: form.company,

               purpose: form.purpose,

               host: form.host,

               status: "Inside"

           };

           visitors.push(visitor);

           saveVisitors(visitors);

           res.writeHead(302, {
               Location: "/"
           });

           res.end();

       });

   }

   // DELETE VISITOR
   else if (req.method === "GET" && req.url.startsWith("/delete")) {

       const id = req.url.split("=")[1];

       let visitors = readVisitors();

       visitors = visitors.filter(v => v.id != id);

       saveVisitors(visitors);

       res.writeHead(302, {

           Location: "/"

       });

       res.end();

   }

   // CHECKOUT VISITOR
   else if (req.method === "GET" && req.url.startsWith("/checkout")) {

       const id = req.url.split("=")[1];

       const visitors = readVisitors();

       visitors.forEach(v => {

           if (v.id == id) {

               v.status = "Checked Out";

           }

       });

       saveVisitors(visitors);

       res.writeHead(302, {

           Location: "/"

       });

       res.end();

   }

   // CSS
   else if (req.method === "GET" && req.url === "/style.css") {

       fs.readFile("style.css", (err, data) => {

           res.writeHead(200, {

               "Content-Type": "text/css"

           });

           res.end(data);

       });

   }

   // PAGE NOT FOUND
   else {

       res.writeHead(404, {

           "Content-Type": "text/html"

       });

       res.end("<h1>404 Page Not Found</h1>");

   }

});

server.listen(PORT, () => {

   console.log("===================================");

   console.log("Visitor Management Server Started");

   console.log("http://localhost:3000");

   console.log("===================================");

});
