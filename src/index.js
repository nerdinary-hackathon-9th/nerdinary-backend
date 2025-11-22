import express from 'express'
import dotenv from "dotenv";
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yamljs';
import SnapRouter from './routes/snap.router.js'
import { errorHandler } from './middlewares/errorHandler.js';
import routers from './routes/routes.index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express()
const port = process.env.PORT;
 
app.use(cors({
  origin: ['http://localhost:5173', 'https://nerdinary-front.vercel.app/'], // 프론트 포트
}));
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger/swagger.yml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// // Router 연결
app.use("/", routers);
app.use("/api/snap", SnapRouter);

//전역 오류 처리 미들웨어
app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})