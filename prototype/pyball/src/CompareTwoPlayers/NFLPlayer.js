export default function NFLPlayer({ player }) {
    return (
        <div>
            <h1>{player.full_name}</h1>
            <h2>{player.house}</h2>
        </div>
    );
}