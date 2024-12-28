import {FC} from "react";
import './Loaders.css'

const Loading: FC<{}> = () => {
    return (
        <div id="loaders-overlay">
            <div id="loaders-overlay--content">
                <div className="loaders-loader"></div>
            </div>
        </div>
    )

}
export default Loading;
