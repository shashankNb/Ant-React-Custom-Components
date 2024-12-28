import {FC} from "react";
import {Flex, Image} from "../../bundles/AntD.tsx";

const Logo: FC<{ width?: string, alt: string, brandLogo?: string }> = ({ width = 245, alt = 'Logo', brandLogo}) => {

    return (
        brandLogo && <Flex style={{marginBottom: '30px'}} justify={'center'}>
            <Image src={brandLogo} alt={alt}
                   style={{height: 'auto', width: width}}/>
        </Flex>
    )
}

export default Logo;