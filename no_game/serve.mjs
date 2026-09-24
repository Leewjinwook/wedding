import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.mp3':'audio/mpeg','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json'};
http.createServer((req,res)=>{
  let url;
  try { url=decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch {res.writeHead(400).end();return;}
  // /wedding/ 는 GitHub Pages 저장소 하위 경로를 로컬에서 검증하는 별칭입니다.
  if(url.startsWith('/wedding/')) url=url.slice(8);
  if(url.endsWith('/')) url+='index.html';
  const file=path.resolve(root,'.'+url);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);});
}).listen(port,'127.0.0.1',()=>console.log(`OUR LITTLE STORY: http://127.0.0.1:${port}/wedding/`));
