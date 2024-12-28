import {Flex, Typography} from "../../bundles/AntD.tsx";
import {ReactNode} from "react";

const TypographyCountry = ({iso_alpha_2, children}: {iso_alpha_2: string, children: ReactNode} ) => {
    return <Flex justify={'start'} align={'center'} gap={5}>
        <img alt={iso_alpha_2} width={16} height={16} src={`https://prod-crm-bucket.s3.ap-southeast-2.amazonaws.com/public/country_flags/${iso_alpha_2.toLowerCase()}.png`} />
        <Typography.Text>{children}</Typography.Text>
    </Flex>
}

export default TypographyCountry;