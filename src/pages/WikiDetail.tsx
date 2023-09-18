import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "authentication/authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ContentsViewer from "components/ContentViewer";
import Swal from "sweetalert2";
import "../components/Wiki.css";

const WikiDetail = () => {
  const navigate = useNavigate();
  // 페이지 정보
  const { page } = useParams();

  //제목, 내용 상태관리
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [displayName, setDisplayName] = useState("");

  // firebase에 문서 가져오기
  useEffect(() => {
    if (page) {
      const fetchUser = async (uid: string) => {
        // ... try, catch 생략
        const userRef = doc(db, "wiki", uid);
        const userSnap = await getDoc(userRef); // 데이터 스냅 받아오기 - 비동기처리
        console.log(userSnap.data());
        if (userSnap.exists()) {
          setTitle(userSnap.data().title);
          setContent(userSnap.data().content);
          setUpdatedAt(userSnap.data().updatedAt);
          setDisplayName(userSnap.data().displayName);
        }
        return null;
      };
      fetchUser(page);
    }
  }, [page]);

  const user = useContext(AuthContext);
  console.log(user);
  console.log(user?.displayName);
  console.log(user?.uid);

  //수정 버튼을 클릭했을때
  const handleEdit = () => {
    //user정보가 없다면
    if (user === null) {
      Swal.fire({
        icon: "error",
        title: "수정 권한 없음",
        text: "수정은 로그인 후에만 가능합니다.  로그인 하시겠습니까 ?",
        showCancelButton: true,
        confirmButtonText: "로그인",
        cancelButtonText: "취소",
      }).then((res) => {
        /* Read more about isConfirmed, isDenied below */
        if (res.isConfirmed) {
          //삭제 요청 처리
          navigate("/login");
        }
      });
    } else {
      navigate("edit");
    }
  };

  return (
    <>
      <section className="wiki__wrapper">
        <div className="wiki__header">
          <div className="wiki__title"> {title} </div>
          <button className="wiki__btn-edit" onClick={handleEdit}>
            수정
          </button>
        </div>
        <div className="wiki__textContent">
          <ContentsViewer content={content} />
        </div>
        <div>수정 시각 : {updatedAt}</div>
        <div>수정한 글쓴이 : {displayName} </div>
      </section>
    </>
  );
};

export default WikiDetail;