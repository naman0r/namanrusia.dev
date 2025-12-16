export default function ContentPage() {
  const contentItems = [
    {
      title: "How to run 100 miles (REI video)",
      duration: "28 minutes",
      url: "https://youtu.be/iC7Lh4opLsc?si=M4OA-Onp2j8kNg64",
      highlighted: false,
      note: "",
    },
    {
      title: "The End Of The World with Josh Clark",
      duration: "Limited podcast series",
      url: "#",
      highlighted: false,
      note: null,
    },
    {
      title: "Randy Pausch's Last Lecture: Achieving Your Childhood Dreams",
      duration: "1hr 16m",
      url: "https://youtu.be/ji5_MqicxSo?si=ERz0RV_7jWAqT6Gi",
      highlighted: true,
      note: null,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <h1 className="text-2xl font-bold text-neutral-100 mb-8">
          My favorite media.
        </h1>

        {/* Introduction */}
        <div className="space-y-4 mb-12 text-neutral-400 leading-relaxed">
          <p>
            this is a list of media that has had a tremendous affect on me. I
            want to come back periodically to update this list
          </p>
          <p></p>
        </div>

        {/* Content List */}
        <ul className="space-y-3">
          {contentItems.map((item, index) => (
            <li key={index}>
              <div className="flex items-baseline gap-2">
                <span className="text-neutral-600">•</span>
                <div>
                  <a
                    href={item.url}
                    className={`hover:underline transition-colors ${
                      item.highlighted ? "text-red-400" : "text-blue-400"
                    }`}
                  >
                    {item.title}
                  </a>
                  <span className="text-neutral-600 ml-2">
                    ({item.duration})
                  </span>
                  {item.note && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.note.split(". ").map((note, i) => (
                        <div key={i} className="flex items-baseline gap-2">
                          <span className="text-neutral-600">*</span>
                          <span className="text-neutral-500 text-sm">
                            {note}
                            {i < item.note.split(". ").length - 1 ? "." : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <footer className="fixed bottom-5">
          <p className="text-neutral-600 text-sm">
            page inspired by{" "}
            <a
              href="https://farza.com/content"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              farza's content list
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
