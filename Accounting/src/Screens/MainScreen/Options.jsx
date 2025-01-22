import styled from 'styled-components';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import Loader from '../../Tools/Loader'
import { refreshAccessToken } from '../../Tools/authService'
import Drawer from '../../Tools/Drawer'
import { BackGround, Card, InputField, Button, SearchField, TopBar } from '../../Tools/Components'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../Tools/TableComponent"
import { useTranslation } from 'react-i18next';

function Options() {
    const { t } = useTranslation();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('user_data'));

    const backToMain = () => {
        navigate("/main");
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const excelDownload = async () => {
        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        const response = await axios.get(`${import.meta.env.VITE_API_URL_DATA}/export-excel/${userData.user_name}/`, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`
            },
            responseType: 'blob' // Important: specifies response data type
        });

        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Create a temporary anchor element to trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'data.xlsx'; // Set the desired file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const pdfDownload = async () => {
        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        const response = await axios.get(`${import.meta.env.VITE_API_URL_DATA}/export-pdf/${userData.user_name}/`, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`
            },
            responseType: 'blob' // Important: specifies response data type
        });

        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: 'application/pdf' });

        // Create a temporary anchor element to trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'data.pdf'; // Set the desired file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (<StyledWrapper>
        <BackGround className="Container">
            <TopBar drawerButton_Onclick={toggleDrawer(true)} backButton_Onclick={backToMain} Text={t("options")} />
            <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
            <Card className="ItemsContainer">
                <span className='FirstRow'>
                    <label className='FirstRowLabel'>{t("downloadData")}</label>
                    <Button onClick={excelDownload} classNam="FirstRowBtn">{t("excel")}</Button>
                    <Button onClick={pdfDownload} className="FirstRowBtn">{t("pdf")}</Button>
                </span>
            </Card>
        </BackGround>
    </StyledWrapper>)
}

const StyledWrapper = styled.div`
.Container {
  display: flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;

  height:100vh;
}

.ItemsContainer{
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 0.4em;

    margin-top: 5em;
    margin-left: 0.5em;
    margin-right: 0.5em;
    margin-bottom: 5em;

    background-color: hsla(0, 0%, 9%, 0.788);
    backdrop-filter: blur(5px);
    opacity:1;
    border-radius: 25px;

    width:35vw;
    height: 35vh;

     box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
}

.FirstRow{
    display:flex;
    align-items:center;

    margin-top:1em;
    
    .FirstRowBtn{
        margin-left:1em;
        margin-right:1em;
    }

    .FirstRowLabel{
        margin-right:1em;
        margin-left:1em;
        color:white;
    }
}

@media (min-width: 768px) and (max-width: 1024px){
    .ItemsContainer{
        margin-top: 5em;
        margin-left:0.5em;
        margin-right:0.5em;
        margin-bottom:1.5em;

        padding:0.5em;

        width:60vw;
        height: 40vh;
    }

}
  

@media (max-width: 768px) {
    .ItemsContainer{
        margin-top: 5em;
        margin-left:0.5em;
        margin-right:0.5em;
        margin-bottom:1.5em;

        padding:0.5em;

        width:75vw;
        height: 35vh;
    }

}  
`;


export default Options