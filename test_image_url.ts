import { getPublicImageUrl } from './lib/backend-config';

console.log(getPublicImageUrl("https://api.mcnid.net/public/uploads/2943b5dd-81f2-462f-948e-0d4aa730fadc.png"));
console.log(getPublicImageUrl("/public/uploads/2943b5dd-81f2-462f-948e-0d4aa730fadc.png"));
console.log(getPublicImageUrl("/uploads/2943b5dd-81f2-462f-948e-0d4aa730fadc.png"));
