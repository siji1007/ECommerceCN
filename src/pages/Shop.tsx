import logoIcon from '../assets/logoIcon.png';
const shopPage: React.FC = () => {
    return(
        <>
            <header className="flex w-full h-100vh bg-red-900 justify-center items-center">
                <img className='cover-full' src={logoIcon} alt="test" />
            </header>


            <main className='flex-grow flex flex-col justify-center items-center overflow-auto h-min-screen m-5'>
                <h1>this is the main content element</h1>
            </main>


        </>
    )

}
export default shopPage;
