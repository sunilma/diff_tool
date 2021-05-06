display_diff = () => {
    const original = document.getElementById("original").value;
    const modified = document.getElementById("modified").value;

    const original_sentences = original.match(/[^?!.]*[?!.]/g);
    const modified_sentences = modified.match(/[^?!.]*[?!.]/g);

    const count = original_sentences.length > modified_sentences.length ? modified_sentences.length : original_sentences.length;
    for (let i = 0; i < count; i++) {
      const val1 = split(original_sentences[i]);
      const val2 = split(modified_sentences[i]);

      const diff = difference(val1, val2);

      const displayData = diff_text(diff);

      document.getElementById("diff_display").innerHTML += `<li>${displayData}</li>`;
    }
    
    if (modified_sentences.length < original_sentences.length) {
      for (let i = modified_sentences.length; i < original_sentences.length; i++) {
        document.getElementById("diff_display").innerHTML += `<li><span class="old">${original_sentences[i]}</span></li>`;
      }
    }

    if (original_sentences.length < modified_sentences.length) {
      for (let i = original_sentences.length; i < modified_sentences.length; i++) {
        document.getElementById("diff_display").innerHTML += `<li><span class="new">${modified_sentences[i]}</span></li>`;
      }
    }
    

    
}


const split = (item) => {
    const items = item.split(" ");
    return items;
}

const longest_common_subsequence = (val1, val2, val1_start, val1_end, val2_start, val2_end) => {
    let lcs_first = [], lcs_last = [];
    while (val1[val1_start] == val2[val2_start] && val1_start < val1_end && val2_start < val2_end) {
        lcs_first.push(val1[val1_start]);
        val1_start++;
        val2_start++;
    }

    while (val1[val1_end - 1] == val2[val2_end - 1] && val1_start < val1_end && val2_start < val2_end) {
        lcs_last.push(val1[val1_end - 1]);
        val1_end--;
        val2_end--;
    }
    lcs_last.reverse();

    let histogram = {};
    
    for (let i = val1_start; i < val1_end; i++) {
        let rec = histogram[val1[i]]
        if (rec) {
            rec.ac++; rec.ai = i
        } else {
        histogram[val1[i]] = { ac: 1, ai: i, bc: 0, bi: -1 }
        }
    }
    for (let i = val2_start; i < val2_end; i++) {
        let rec = histogram[val2[i]]
        if (rec) {
            rec.bc++; rec.bi = i
        } else {
            histogram[val2[i]] = { ac: 0, ai: -1, bc: 1, bi: i }
        }
      }
    

    let cmp = Number.MAX_VALUE
    
    let lcs_mid = null

    for (let word in histogram) {
      let rec = histogram[word]
      if (rec.ac > 0 && rec.bc > 0 && rec.ac + rec.bc < cmp) {
        lcs_mid = word;
        cmp = rec.ac + rec.bc;
      }
    }

    if (!lcs_mid) return [...lcs_first,...lcs_last]
    let rec = histogram[lcs_mid]
    
    return [...lcs_first, ...longest_common_subsequence(val1,val2,val1_start,rec.ai,val2_start,rec.bi),
                lcs_mid, ...longest_common_subsequence(val1,val2,rec.ai+1,val1_end,rec.bi+1,val2_end), ...lcs_last]

}

const difference = (val1, val2) => {
  let difference = longest_common_subsequence(val1, val2, 0, val1.length, 0, val2.length);
  let old = 0;
  let mod = 0;
  let diff = [];

  const setValue = (title, value) => {
    const data = {
      title: title,
      value: value
    }
    return data;
  }

  for (let i = 0; i < difference.length; i++) {
    while(old < val1.length && val1[old] != difference[i]){
      diff.push(setValue(val1[old], -1));
      old++;
    }
    while(mod < val2.length && val2[mod] != difference[i]) {
      diff.push(setValue(val2[mod], 1));
      mod++;
    }
    diff.push(setValue(difference[i], 0));
    old++;
    mod++;
  }

  while (old < val1.length) {
    diff.push(setValue(val1[old], -1));
    old++;
  }
  while (mod < val2.length) {
    diff.push(setValue(val2[mod], 1));
    mod++;
  }
  return diff;
}



const diff_text = (data) => {
  const display = data.map((item) => {
    if (item.value > 0) {
      return  `<span class="new">${item.title}</span>`;
    } else if (item.value < 0) {
      return  `<span class="old">${item.title}</span>`;
    } else {
      return `<span class="neutral">${item.title}</span>`;
    }

  })
  return display.join(" ");
}


// displaying different content

const display_old = () => {
  change_display(document.getElementsByClassName("old"),"visible");
  change_display(document.getElementsByClassName("neutral"), "hidden");
  change_display(document.getElementsByClassName("new"), "hidden");
}

const display_common = () => {
  change_display(document.getElementsByClassName("old"),"hidden");
  change_display(document.getElementsByClassName("neutral"), "visible");
  change_display(document.getElementsByClassName("new"), "hidden");
}

const display_new = () => {
  change_display(document.getElementsByClassName("old"),"hidden");
  change_display(document.getElementsByClassName("neutral"), "hidden");
  change_display(document.getElementsByClassName("new"), "visible");
}

const display_all = () => {
  change_display(document.getElementsByClassName("old"),"visible");
  change_display(document.getElementsByClassName("neutral"), "visible");
  change_display(document.getElementsByClassName("new"), "visible");
}

const change_display = (element, data) => {
  for (let i = 0; i < element.length; i++) {
    element[i].style.visibility = data;
  }
}