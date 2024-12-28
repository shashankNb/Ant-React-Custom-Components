import { FC, useEffect } from "react";
import ColumnHoc from "../../components/Hoc/ColumnHoc.tsx";

const HomeDashboard: FC<any> = ({ columnProps }) => {

    useEffect(() => { }, []);

    return (
        <><h1>Welcome Back !</h1></>
    )
}

export default ColumnHoc(HomeDashboard);