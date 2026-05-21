export function initForm() {

  const form = document.querySelector("#ticket-form");

  form.addEventListener("submit", (event) => {

    event.preventDefault();

    const origem = document.querySelector("#origem").value;
    const destino = document.querySelector("#destino").value;
    const data = document.querySelector("#data").value;

    console.log({
      origem,
      destino,
      data
    });

    alert("Busca realizada com sucesso!");
  });
}