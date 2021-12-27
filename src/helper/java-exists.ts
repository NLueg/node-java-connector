import * as findJavaHome from 'find-java-home';

export async function systemJavaExists(): Promise<boolean> {
  let ret = false;

  const systemJavaHome = await getSystemJavaHome();

  if (!!systemJavaHome && systemJavaHome !== '') {
    ret = true;
  }

  return ret;
}

async function getSystemJavaHome(): Promise<string> {
  let ret = '';

  await findJavaHome({ allowJre: true }, async (err, home) => {
    if (err) {
      console.log(err);
      return;
    }
    ret = home;
  });

  return ret;
}
