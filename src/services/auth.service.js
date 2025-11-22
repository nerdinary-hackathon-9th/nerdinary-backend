import { responseLoginDTO } from '../dtos/auth.dto.js';
import { ExistsError, NotFoundUserError, WrongUserInfo } from '../errors.js';

import {
  createUser,
  getPassword,
  getUser,
} from "../repositories/user.repository.js";

export const userLogin = async (nickname, password) => {
    const user = await getUser(nickname);
    if(user === null){
        throw new NotFoundUserError("존재하지 않는 사용자입니다.");
    }

    const userPassword = await getPassword(nickname);
    if(password !== userPassword){
        throw new WrongUserInfo("로그인 정보가 일치하지 않습니다.", nickname);
    }

    return responseLoginDTO({id : user.id});
}

export const userSignup = async (data) => {

  console.log("service: ",data)
  const user = await getUser(data.nickname);
  if(user){
    throw new ExistsError('이미 존재하는 사용자입니다.');
  }
  console.log(data.nickname, data.password)
  const joinUserId = await createUser({
    nickname : data.nickname,
    password : data.password
  });

  return responseLoginDTO({ id : joinUserId })
};

