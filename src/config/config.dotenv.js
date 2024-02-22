import dotenv from 'dotenv'


const result = dotenv.config({
    override: true,
    path: "./.env"
});
if (result.error) {
    console.error("Error loading .env:", result.error);
}

export const config={
    PORT:process.env.PORT||8080,
    MODE:process.env.MODE||"development",
    MONGO_URL:process.env.MONGO_URL, 
    SECRETCODE:process.env.SECRETCODE, 
    DBNAME:process.env.DBNAME,
    GITHUB_CLIENT:process.env.GITHUB_CLIENT,
    GITHUB_SECRET:process.env.GITHUB_SECRET
}