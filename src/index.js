import express from 'express'
import dotenv from "dotenv";
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yamljs';
import routers from "./routes/routes.index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express()
const port = process.env.PORT;

app.use(cors());                            // cors 방식 허용x
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// 미들웨어 등록 코드
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ 
      resultType: "SUCCESS", 
      error: null, 
      success 
    });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

//전역 오류 처리하기 위한 미들웨어
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger/swagger.yml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Router 연결
app.use("/", routers);

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})