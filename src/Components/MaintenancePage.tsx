import maintenance from '../assets/Maintenance.svg'

const MaintenancePage: React.FC = () => {

    return(
        <>
        <div className="flex items-center justify-center">
            <div className="absolute text-4xl lg:text-[100px] font-bold uppercase opacity-20 lg:rotate-[-20deg]"> Under Maintenance</div>
            <img src={maintenance} alt="404 Notfound"  className="h-[700px]"/>
        </div>
        </>
    );
}

export default MaintenancePage;