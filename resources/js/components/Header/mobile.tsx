import React from 'react';
import { Link } from "react-router-dom";
import {useSelector} from 'react-redux';
import authUser from '../../state/auth_user';
import {limit} from '../../helpers/util';

type HeaderProps = {
    header_title?: string,
    hide_icon?: boolean,
    current_page: string
};

const backIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAB30lEQVRoge2ZPW8UMRCGn0F0XNrU663zr5CIyHFQEsKHkpDkUgJhvU3yq+hz/bVeWoZiiZAuLnJrjzeR9m1Hsp7X44/xGCZNmjRpa6mKa8KV82GeOpTk4NlKquLa7gqYAwosVgc7zdDhnmUDe4hUxfnuBz089BOYlInnWcAeoruZFzZhRWBv6LBlMtDDf4d78ADXt+vZ4AzYG+iXzTdgEYler9azfY7lz9DhzQ3U7e8lwttIKBkejE+h2neXir6PhLLAg2EGqqZbWsOD0SlU+e5C0MNIKCs8GCyhf/AfIqHs8JDZgPPhHDiKhEzgIeMecG04ozA8ZMqAa8MZysdIyBQeMhhwPnwFPkVC5vCQuIRcE04ZER4SMuCacIrwORIqBg8DM1D7cPIY4GGAgboJxwpfIqHi8JC1lJDyrzsG7oHah5N4FuRmtX7xqmQWDDZxWRNJaX8MJgwvsjImjEsJexPZTo6xTBQqp+1MFHzQ2JgwuXxKmjC7PaumW4rE3sV5TYzUVslnwrx+sTZhX4DdtRaj3bl0E2UqyP/N3Uh/NM1Eme60iK5ez94BkY8MfVnvdk/gg6M3sUD5uRFRlF+Dh03E2l4bX0yivLmd7/jiHElSlcoHX7Vhf2yUSZMmjay/AkobJMlU9UcAAAAASUVORK5CYII=`;
const homeIcon = `data:image/png;base64,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`;
const searchIcon = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCI+PHBhdGggZmlsbD0iI2RhZGNlYyIgZD0iTTQwLjc4IDQxLjQ2SDQ2LjMyVjQ1LjQ2SDQwLjc4eiIgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDQzLjU0MyA0My40NjQpIi8+PHJlY3Qgd2lkdGg9IjguNDkiIGhlaWdodD0iMjIuNTEiIHg9IjQ4LjgiIHk9IjQxLjc5IiBmaWxsPSIjY2RhMWE3IiByeD0iNCIgcnk9IjQiIHRyYW5zZm9ybT0icm90YXRlKC00NSA1My4wNCA1My4wNCkiLz48cmVjdCB3aWR0aD0iNC4yNCIgaGVpZ2h0PSIyMi41MSIgeD0iNDkuNDIiIHk9IjQzLjI5IiBmaWxsPSIjYzQ5MzljIiByeD0iMi4xMiIgcnk9IjIuMTIiIHRyYW5zZm9ybT0icm90YXRlKC00NSA1MS41NDIgNTQuNTQpIi8+PHBhdGggZmlsbD0iI2ZmZWI5YiIgZD0iTTI1IDFBMjQgMjQgMCAxIDAgMjUgNDlBMjQgMjQgMCAxIDAgMjUgMVoiLz48cGF0aCBmaWxsPSIjZjZkMzk3IiBkPSJNMTEuMTQsMzguODYsMzguODYsMTEuMTRhNCw0LDAsMCwxLDYuMTEuNTRBMjQsMjQsMCwwLDEsMTEuNjgsNDUsNCw0LDAsMCwxLDExLjE0LDM4Ljg2WiIvPjxwYXRoIGZpbGw9IiNiYmRlZjkiIGQ9Ik0yNSA3QTE4IDE4IDAgMSAwIDI1IDQzQTE4IDE4IDAgMSAwIDI1IDdaIi8+PHBhdGggZmlsbD0iI2QyZWRmZiIgZD0iTTI1IDE4QTcgNyAwIDEgMCAyNSAzMkE3IDcgMCAxIDAgMjUgMThaIi8+PHBhdGggZmlsbD0iI2YzZjNmMyIgZD0iTTIxIDE3QTQgNCAwIDEgMCAyMSAyNSA0IDQgMCAxIDAgMjEgMTd6TTI5LjUgMjhBMS41IDEuNSAwIDEgMCAyOS41IDMxIDEuNSAxLjUgMCAxIDAgMjkuNSAyOHoiLz48cGF0aCBmaWxsPSIjOGQ2YzlmIiBkPSJNMzguNDQsMTEuNTdhMTksMTksMCwxLDAsMCwyNi44N0ExOC44OCwxOC44OCwwLDAsMCwzOC40NCwxMS41N1pNMzcsMzdhMTcsMTcsMCwxLDEsMC0yNEExNi44OSwxNi44OSwwLDAsMSwzNywzN1oiLz48cGF0aCBmaWxsPSIjOGQ2YzlmIiBkPSJNMzEuMiAxNC43MmExMiAxMiAwIDAgMSAyLjI4IDEuNzlBMSAxIDAgMSAwIDM0LjkgMTUuMSAxNC4wOCAxNC4wOCAwIDAgMCAzMi4yMyAxM2ExIDEgMCAwIDAtMSAxLjcxek0yNi4zOCAxMS4wN2ExNCAxNCAwIDAgMC0xMS4yNyA0IDEgMSAwIDEgMCAxLjQxIDEuNDEgMTIgMTIgMCAwIDEgOS42Ny0zLjQ2IDEgMSAwIDEgMCAuMi0yeiIvPjxwYXRoIGZpbGw9IiM4ZDZjOWYiIGQ9Ik02MS44OCw1NC40Niw1MS41NCw0NC4xMmE1LDUsMCwwLDAtMy42LTEuNDVjMC0uMTQtMi43Ny0yLjkxLTIuNzctMi45MWEyNSwyNSwwLDEsMC01LjQxLDUuNDFzMi43OCwyLjcyLDIuOTEsMi43NywwLDAsMCwuMDdhNSw1LDAsMCwwLDEuNDYsMy41NEw1NC40Niw2MS44OGE1LDUsMCwwLDAsNy4wNywwbC4zNC0uMzRhNSw1LDAsMCwwLDAtNy4wN1pNMiwyNUEyMywyMywwLDEsMSwyNSw0OCwyMywyMywwLDAsMSwyLDI1Wk00NC4xMiw0NC40NmE1LDUsMCwwLDAtLjkyLDEuMzJsLTEuODctMS44N2EyNS4yLDI1LjIsMCwwLDAsMi41OS0yLjU5bDEuODgsMS44OGE1LDUsMCwwLDAtMS4zMi45MlpNNjAuNDYsNjAuMTJsLS4zNC4zNGEzLDMsMCwwLDEtNC4yNCwwTDQ1LjU0LDUwLjEyYTMsMywwLDAsMSwwLTQuMjRsLjM0LS4zNGEzLDMsMCwwLDEsNC4yNCwwTDYwLjQ2LDU1Ljg4YTMsMywwLDAsMSwwLDQuMjRaIi8+PHBhdGggZmlsbD0iIzhkNmM5ZiIgZD0iTTM0LjE5IDMyLjc4YTEgMSAwIDAgMC0xLjQxIDEuNDFsMS40MSAxLjQxYTEgMSAwIDAgMCAxLjQxLTEuNDF6TTE1LjgxIDMyLjc4bC0xLjQxIDEuNDFhMSAxIDAgMSAwIDEuNDEgMS40MWwxLjQxLTEuNDFhMSAxIDAgMCAwLTEuNDEtMS40MXpNMzkgMjRIMzdhMSAxIDAgMCAwIDAgMmgyYTEgMSAwIDAgMCAwLTJ6TTE0IDI1YTEgMSAwIDAgMC0xLTFIMTFhMSAxIDAgMCAwIDAgMmgyQTEgMSAwIDAgMCAxNCAyNXpNMjUgMzZhMSAxIDAgMCAwLTEgMXYyYTEgMSAwIDAgMCAyIDBWMzdBMSAxIDAgMCAwIDI1IDM2ek0zOC4yOCAyOS41NWwtMS44NC0uNzhhMSAxIDAgMSAwLS43OCAxLjg0bDEuODQuNzhhMSAxIDAgMSAwIC43OC0xLjg0ek0yMC43IDM1LjEzYTEgMSAwIDAgMC0xLjMxLjUzbC0uNzggMS44NGExIDEgMCAxIDAgMS44NC43OGwuNzgtMS44NEExIDEgMCAwIDAgMjAuNyAzNS4xM3pNMTQuOCAyOS4xMmExIDEgMCAwIDAtMS4zLS41NWwtMS44NS43NWExIDEgMCAxIDAgLjc1IDEuODVsMS44NS0uNzVBMSAxIDAgMCAwIDE0LjggMjkuMTJ6TTMwLjQyIDM1Ljc1YTEgMSAwIDAgMC0xLjg1Ljc1bC43NSAxLjg1YTEgMSAwIDAgMCAxLjg1LS43NXoiLz48L3N2Zz4=`;
const addIcon = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCI+PHBhdGggZmlsbD0iIzg1Y2JmOCIgZD0iTTMxIDNBMjggMjggMCAxIDAgMzEgNTlBMjggMjggMCAxIDAgMzEgM1oiLz48cGF0aCBmaWxsPSIjYzJjZGU3IiBkPSJNMzEsM0EyOCwyOCwwLDEsMCw1OSwzMSwyOCwyOCwwLDAsMCwzMSwzWm0wLDUwQTIyLDIyLDAsMSwxLDQ2LjE3LDE1LjA3bC42OC42N3EuMzkuNC43NS44MkEyMiwyMiwwLDAsMSwzMSw1M1oiLz48cGF0aCBmaWxsPSIjYWNiN2QwIiBkPSJNMzEsNTNBMjIsMjIsMCwwLDEsOSwzMUg3LjM0YTQsNCwwLDAsMC0zLjk1LDQuNzEsMjgsMjgsMCwwLDAsNTUuMjEsMEE0LDQsMCwwLDAsNTQuNjYsMzFINTNBMjIsMjIsMCwwLDEsMzEsNTNaIi8+PHBhdGggZmlsbD0iIzhkNmM5ZiIgZD0iTTMxLDJBMjksMjksMCwxLDAsNjAsMzEsMjksMjksMCwwLDAsMzEsMlptMCw1NkEyNywyNywwLDEsMSw1OCwzMSwyNywyNywwLDAsMSwzMSw1OFoiLz48cGF0aCBmaWxsPSIjOGQ2YzlmIiBkPSJNMzEgNTBhMSAxIDAgMCAwLTEgMXYyYTEgMSAwIDAgMCAyIDBWNTFBMSAxIDAgMCAwIDMxIDUwek0zNyA1MC4wOGExIDEgMCAwIDAtMS45My41MmwuNTIgMS45M0ExIDEgMCAwIDAgMzcuNTMgNTJ6TTIxLjc1IDQ3LjUyYTEgMSAwIDAgMC0xLjM3LjM3bC0xIDEuNzNhMSAxIDAgMSAwIDEuNzMgMWwxLTEuNzNBMSAxIDAgMCAwIDIxLjc1IDQ3LjUyek00MS42MiA0Ny44OWExIDEgMCAxIDAtMS43MyAxbDEgMS43M2ExIDEgMCAxIDAgMS43My0xek0yNi4yMSA0OS4zN2ExIDEgMCAwIDAtMS4yMi43MUwyNC40NyA1MmExIDEgMCAxIDAgMS45My41MmwuNTItMS45M0ExIDEgMCAwIDAgMjYuMjEgNDkuMzd6Ii8+PHBhdGggZmlsbD0iI2ZhZWZkZSIgZD0iTTQzLDMwSDMyVjE5YTEsMSwwLDAsMC0yLDBWMzBIMTlhMSwxLDAsMCwwLDAsMkgzMFY0M2ExLDEsMCwwLDAsMiwwVjMySDQzYTEsMSwwLDAsMCwwLTJaIi8+PHBhdGggZmlsbD0iIzhkNmM5ZiIgZD0iTTM4LjM1IDExLjMyYTIxIDIxIDAgMCAxIDIuMS45MiAxIDEgMCAwIDAgLjktMS43OSAyMyAyMyAwIDAgMC0yLjMtMSAxIDEgMCAxIDAtLjcgMS44N3pNMTYuMTUgMTYuMTVhMjEuMDggMjEuMDggMCAwIDEgMTguMTktNS44OCAxIDEgMCAxIDAgLjMyLTIgMjMgMjMgMCAwIDAtMTkuOTIgMzkgMSAxIDAgMCAwIDEuNDEtMS40MUEyMSAyMSAwIDAgMSAxNi4xNSAxNi4xNXpNNDcuMjYgMTQuNzRhMjMuMTkgMjMuMTkgMCAwIDAtMi4wOS0xLjg2IDEgMSAwIDAgMC0xLjIzIDEuNTcgMjEuMjYgMjEuMjYgMCAwIDEgMS45MSAxLjcgMjEgMjEgMCAwIDEgMCAyOS43IDEgMSAwIDEgMCAxLjQxIDEuNDFBMjMgMjMgMCAwIDAgNDcuMjYgMTQuNzR6Ii8+PC9zdmc+`;
const heartIcon = `data:image/png;base64,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`;
const loginIcon = `data:image/png;base64,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`;
const avatarIcon = "data:image/png;base64,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";

const Header: React.FC<HeaderProps> = ({header_title, hide_icon, current_page})=>{
    const {user} = authUser();

    return (
        <header className='hide-desktop'>
            <div className='fixed-wrapper'>
                <nav className="header border">
                    {!hide_icon?(
                        <div className="photo-btn">
                            <img src="/favicon/favicon.ico"/>
                        </div>)
                    :(
                        <div className="photo-btn">
                            <img id='go_back' src={backIcon} onClick={()=>history.back()} />
                        </div>
                    )}

                    {!header_title?
                    <Link to="/"><h1 className='header-title bg-logo'> </h1></Link>
                    : <div className='header-title'> {limit(header_title, 19)} </div> }
                </nav>
            </div>

            <footer className='border footer'>
                <div className="row btns">
                    <div className="col col-fill btn" id={`curr-${current_page=='/'}`}>
                        <Link to="/"> <img src={homeIcon}/> </Link>
                    </div>
                    <div className="col col-fill btn" id={`curr-${current_page=='explore'}`}>
                        <Link to="/explore"> <img src={searchIcon}/> </Link>
                    </div>
                    <div className="col col-fill btn" id={`curr-${current_page=='add'}`}>
                        <img src={addIcon}/>
                    </div>
                    <div className="col col-fill btn" id={`curr-${current_page=='activity'}`}>
                        <Link to={user?.id ? "/activity": "/login"}> <img src={heartIcon}/> </Link>
                    </div>
                    <div className="col col-fill btn" id={`curr-${current_page=='profile'}`}>
                        {
                            user?.id ?
                                <Link to={`/user/${user.username}`}>
                                    <img className='avatar' src={user.profile_pic ? `/avatar/${user.profile_pic}` : avatarIcon} />
                                </Link>
                                :
                                <Link to="/login"><img src={loginIcon}/> </Link>                                
                        }
                    </div>
                </div>
            </footer>
        </header>
    );
}


export default Header;