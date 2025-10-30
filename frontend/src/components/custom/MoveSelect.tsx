import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Move } from "@/constants/types"
import { Label } from "../ui/label"

export default function MoveSelect({ setMoveChange }: { setMoveChange: React.Dispatch<React.SetStateAction<Move>> }) {
    function onChangeValue(value: string) {
        let move: Move = Move.Null
        switch (value) {
            case "Rock": {
                move = Move.Rock
                break
            }
            case "Paper": {
                move = Move.Paper
                break
            }
            case "Scissors": {
                move = Move.Scissors
                break
            }
            case "Spock": {
                move = Move.Spock
                break
            }
            case "Lizard": {
                move = Move.Lizard
                break
            }
        }
        setMoveChange(move)
    }

    return (
        <>
            <Label className="mb-1" htmlFor="move">Choose your move: </Label>
            <Select onValueChange={(value) => { onChangeValue(value) }}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a move" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Rock">Rock</SelectItem>
                    <SelectItem value="Paper">Paper</SelectItem>
                    <SelectItem value="Scissors">Scissors</SelectItem>
                    <SelectItem value="Spock">Spock</SelectItem>
                    <SelectItem value="Lizard">Lizard</SelectItem>
                </SelectContent>
            </Select >
        </>
    )
}
