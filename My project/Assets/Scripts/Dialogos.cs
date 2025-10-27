using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class TypewriterEffectDialogue : MonoBehaviour
{
    public float typingSpeed = 0.05f;
    public Text textComponent;
    private string fullText;

    void Start()
    {
        fullText = textComponent.text;
        textComponent.text = "Oye… si de verdad no escondes nada, pásame la clave de tus redes sociales. " +
            "Yo ya te conté todas mis cosas, ¿por qué tú no puedes hacerlo? Parece que no confías en mí";
        StartCoroutine(TypeText());
    }

    IEnumerator TypeText()
    {
        foreach (char letter in fullText)
        {
            textComponent.text += letter;
            yield return new WaitForSeconds(typingSpeed);
        }
    }
}

