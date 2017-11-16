using System;

public class Dice{
    public int Id { get; set; }
    public int Face { get; set; }
    public string Image { get; set; }

    public Dice(int id, int face, string image){
        this.Id = id;
        this.Face = face;
        this.Image = image;
    }
}