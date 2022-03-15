type BlockOrMessage =
  | { type: 'block'; page: Block }
  | { type: 'message'; message: Message };

interface Block {
  name: string;
  children: BlockOrMessage[];
}

interface Message {
  text: string;
  children: Message[];
}

/*
  Search: ______________________

  <#general>
  □ #space
  ■ #animals
    ↳ □ #birds
    ↳ ■ #mammals (would have stuff)
  --------------------------------------------------
  Shane: Hello all!
    Alice: Hi!
    Bob: Hi!
    Charlie: Hi!
  Bob: How does this work?
    Charlie: I don't know.
    Shane: You can find docs at https://website.com
      Leon: And more docs at https://website.com/more
    Bob: Awesome, thanks!
  Charlie: I'm going to go to the zoo tomorrow.
    Bob: Better see the #birds!
    Shane: Yes!
    Charlie: We need a #birds/owls page!
    Shane: It's easy as clicking that mention to create the page!
  Shane: And we can also have a conversation in the root level too!
  Shane: Right here!
  Bob: This is awesome!
    Shane: Thanks!
  Charlie: Yeah, this is great!
  ------------------Top-Level View------------------
  Shane: Hello all!
    (3)
  Bob: How does this work?
    (3)
  Charlie: I'm going to go to the zoo tomorrow.
    (4)
  Shane: And we can also have a conversation in the root level too!
  Shane: Right here!
  Bob: This is awesome!
    (1)
  Charlie: Yeah, this is great!
*/
