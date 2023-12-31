import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import { useContext } from "react";
import { AuthContext } from "provider/userContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";

//한국 날짜 설정
dayjs.locale("ko");

const CommentAdd = () => {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  const [comment, setComment] = useState<string>("");

  //등록 버튼, firebase 댓글 추가하기
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user === null) {
      Swal.fire({
        icon: "error",
        title: "댓글 권한 없음",
        text: "댓글 작성은 로그인 후에만 가능합니다.  로그인 하시겠습니까 ?",
        showCancelButton: true,
        confirmButtonText: "로그인",
        cancelButtonText: "취소",
        confirmButtonColor: "#ED234B",
      }).then((res) => {
        /* Read more about isConfirmed, isDenied below */
        if (res.isConfirmed) {
          //삭제 요청 처리
          navigate("/login");
        }
      });
    } else {
      if (comment === "") {
        alert("댓글을 입력하세요");
      } else {
        await addDoc(collection(db, "comment"), {
          comment: comment,
          updatedAt: dayjs().format("YYYY.MM.DD HH:mm:ss"),
          useName: user?.displayName,
          uid: user?.uid,
          class: Number(localStorage.getItem(user.uid)),
        });
      }
    }
    setComment("");
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter 키가 눌렸을 때
    if (e.key === "Enter") {
      handleAddComment(e);
    }
  };

  // input 값 입력 받기
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  return (
    <>
      <Wiki__CommentBox>
        <Wiki_input
          value={comment}
          placeholder="댓글을 입력해주세요"
          name="Reply_write"
          onChange={handleTextChange}
          onKeyDown={handleInputKeyPress}
        ></Wiki_input>
        <Wiki__button onClick={handleAddComment}>등록</Wiki__button>
      </Wiki__CommentBox>
    </>
  );
};

export default CommentAdd;

const Wiki__CommentBox = styled.div`
  height: 40px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;

  padding: 40px 5px 5px 5px;
  //background-color: var(--main-color);
  border-top: 2px solid #ddd;
`;

const Wiki_input = styled.input`
  width: 88%;
  padding: 10px;
  border-radius: 4px;
  font-size: 16px;
  border: 0;
  border: 1px solid #ddd;
  outline: none;
  margin-right: 10px;
`;

const Wiki__button = styled.button`
  background-color: var(--main-color);
  border: none;
  border-radius: 4px;
  color: white;
  width: 8%;
  min-width: 50px;
`;
