namespace Back_End
{
    //Model for note board notes
    public class Note
    {
        //identifier
        public int Id { get; set; }
        //text on note
        public string? Body { get; set; }
        //color of note
        public string? Color { get; set; }
        //translation of note
        public double PositionX { get; set; }
        public double PositionY { get; set; }
        //rotation of note and the pin element attached to it
        public double PaperRotation {  get; set; }
        public double PinRotation { get; set; }
    }
}