using Back_End;
using Microsoft.EntityFrameworkCore;

//instantiate builder for webapp
var builder = WebApplication.CreateBuilder(args);
//add database context to dependency injection container
builder.Services.AddDbContext<NoteDb>(opt => opt.UseInMemoryDatabase("NoteBoard"));
//captures database-related exceptions and displays them, only use in Database dev environment
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
//construct app
var app = builder.Build();

//create map group for grouping common prefixes (/notes in this case)
var notes = app.MapGroup("/notes");

//map endpoints
notes.MapGet("/", GetAllNotes);
notes.MapGet("/{id}", GetNote);
notes.MapPost("/", CreateNote);
notes.MapPut("/{id}", UpdateNote);
notes.MapDelete("/{id}", DeleteNote);

//run app
app.Run();


//GET endpoint for reading all notes
static async Task<IResult> GetAllNotes(NoteDb db)
{
    //return all notes as an array
    return TypedResults.Ok(await db.Notes.ToArrayAsync());
}
//GET endpoint for reading one note
static async Task <IResult> GetNote(int id, NoteDb db)
{
    //search for note by id and return note or return not found if not found
    return await db.Notes.FindAsync(id)
        is Note note
            ? TypedResults.Ok(note)
            : TypedResults.NotFound();
}
//POST endpoint for adding Notes
static async Task <IResult> CreateNote(Note note, NoteDb db)
{
    //add not to database
    db.Notes.Add(note);
    //save database
    await db.SaveChangesAsync();
    //returns note and adds path of created note to the header
    return TypedResults.Created($"/notes/{note.Id}", note);
}
//UPDATE endpoint for updating a note
static async Task <IResult> UpdateNote(int id, Note inputNote, NoteDb db)
{
    //instantiate note matching the id
    var note = await db.Notes.FindAsync(id);
    //return not found if not found
    if (note is null) return TypedResults.NotFound();

    //update the matching note to have the same values as the given note
    note.Body = inputNote.Body;
    note.Color = inputNote.Color;
    note.PositionX = inputNote.PositionX;
    note.PositionY = inputNote.PositionY;
    note.PaperRotation = inputNote.PaperRotation;
    note.PinRotation = inputNote.PinRotation;

    //save database
    await db.SaveChangesAsync();
    //return no content
    return TypedResults.NoContent();
}
//DELETE endpoint for deleting a note
static async Task <IResult> DeleteNote(int id, NoteDb db)
{
    //search for note by id, if found delete it
    if (await db.Notes.FindAsync(id) is Note note)
    {
        //remove note from the database
        db.Notes.Remove(note);
        //save database and return no content
        await db.SaveChangesAsync();
        return TypedResults.NoContent();
    }
    //if not found return not found
    return TypedResults.NotFound();
}






