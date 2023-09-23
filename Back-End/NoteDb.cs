using Microsoft.EntityFrameworkCore;

namespace Back_End
{
    public class NoteDb : DbContext
    {
        //constructor for database
        public NoteDb(DbContextOptions<NoteDb> options)
        : base(options) { }
        //instantiate database set of note objects
        public DbSet<Note> Notes => Set<Note>();
    }
}
