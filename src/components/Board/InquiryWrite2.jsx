import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


export default function InquiryWrite2() {
    const { id } = useParams();
    const [productData, setProductData] = useState([]);
    const navigate = useNavigate();

    const isLoggedIn =
        sessionStorage.getItem("loggedInUser");
    const user = isLoggedIn ? JSON.parse(isLoggedIn) : null;
    const userName = user ? user.user_name : ''; // 유저 이름 변수

    const inquirySubmit = async () => {
        const inquiryTitleInput = document.querySelector('input[id="inquiry_title"]');
        const inquiryTitle = inquiryTitleInput.value.trim();

        if (!inquiryTitle) {
            alert("제목을 입력하세요.");
            return;
        }

        let url = "https://port-0-petmilyreal-1272llwrbm1kq.sel5.cloudtype.app/api/inquiry/insert";

        await axios({
            url: url,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: {
                inquiry_title: document.getElementById('inquiry_title').value,
                // inquiry_writer: document.getElementById('inquiry_writer').value,
                inquiry_writer: userName,
                product_id: id,
                inquiry_content: document.getElementById('inquiry_content').value
            }

        }).then(response => {
            alert(`상품문의 등록 완료되었습니다.`);
            navigate('/community/inquiry');
        }).catch(error => {
            console.error(`에러 응답 = ${error.response},
			error status = ${error.response.status},
			error message = ${error.message}`);
        });
    }

    const getProductData = () => {
        axios.get(`https://port-0-petmilyreal-1272llwrbm1kq.sel5.cloudtype.app/api/rsproduct/productDetail/${id}`)
            .then((response) => {
                setProductData(response.data);
                console.log(`** productDetail 서버연결 성공 =>`, response.data);
            })
            .catch((err) => {
                alert(`** productDetail 서버연결 실패 => ${err.message}`);
            });
    };

    useEffect(() => {
        getProductData();
    }, []);

    return (
        <div className="write">
            <div className="cateTitle">
                <h1>상품문의</h1>
            </div>

            <div>
                <div className="selectStarRegist">
                    <span>상품명 : {productData.product_name}</span>

                    <div id="registButton">
                        <input onClick={inquirySubmit} value="등록" />
                    </div>
                </div>

                <div>
                    <form>
                        <input id="inquiry_title" type="text" placeholder="제목을 입력하세요." maxLength="100" required />
                        <textarea id="inquiry_content" rows="30" cols="100"></textarea>
                        <input type='hidden' id='inquiry_writer' value={userName} />
                    </form>
                </div>
            </div>

            <div id="bottomBoard">
                <Link to="/community/inquiry">
                    <input type="button" value="목록" />
                </Link>
            </div>
        </div>
    );
}
