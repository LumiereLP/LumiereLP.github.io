---
layout: post
title: "数据库管理及应用（Access）笔记"
date: 2026-06-04 12:00:00 +0800
categories: 学术笔记
math: true
---

# 数据库管理及应用（Access）笔记

## 主题1 数据模型及范式

### 1-1 数据库系统

#### 1. 数据库系统的构成

数据库系统呈现出层级结构，主要包含：

- **数据**：对客观事物的抽象描述，是信息的具体保表现形式；
- **数据库**：保存数据的容器，是一组逻辑相关的数据的集合；
- **数据库管理系统（DBMS）**：是一类具有数据定义、数据查询、数据操纵、数据控制、数据库运行管理、数据库的建立和维护等主要功能的系统软件；
- **数据库系统**：一个完整的数据库系统由保存数据的数据库、数据库管理系统、用户应用程序和用户组成。

一个数据库应当具有如下功能：

- 提供数据定义语言（**DDL**）
- 提供数据查询语言（**DQL**）
- 提供数据操纵语言（**DML**）
- 支持大量数据存储
- 控制并发送访问

#### 2. 数据库系统的三级模式结构和二级映像

数据库系统的三级模式结构指：

- 模式：又称逻辑模式，是数据库中全部数据的逻辑结构和特征的描述，是对数据的结构和属性的描述；
- 外模式：又称子模式或用户视图，是用户视角的数据库，一个模式可以有多个外模式；
- 内模式：又称储存模式，是数据的物理结构和储存方式耳朵描述，一个模式只有一个内模式

数据库系统的二级映射指：

- **模式/内模式映像**：链接数据的逻辑结构和物理储存，**有且仅有一个**。这个英雄保证了数据的**物理独立性**，即数据库的物理储存改变只会引起这个映像的修改。
- **外模式/模式映像**：链接数据的用户界面和逻辑结构，可以有很多个。如果数据库整体逻辑改变，则只需修改这个映像，前端用户视图不会改变。

### 1-2 数据模型

#### 1. 实体-关系（E-R）模型

- 实体（Entity）：实际问题中存在并可以相互区别的事物，是现实世界中对象；
- 属性（Attribute）：实体具有的不可分的、独立的某一特性。要求：
  - **不可分性**：属性必须是不可分的最小数据项，不能包含其他属性，
  - **独立性**：属性不能与其他实体有关系；
- 实体集：具有相同属性的实体的集合称为实体集；
- 键（Key）：可以唯一标识实体集中每个实体的属性；
- 实体型：形如

    实体（<u>属性1</u>，属性2，……，属性 n）

    的数据结构称为实体型，其中每个实体集只有一个主题和一个键。

- 关系：E-R模型语境下的关系本质是\\(n\\)元有序组的集合。即一个\\(n\\)元关系是实体集笛卡尔积的子集，即\\[R \subsetneq E_1 \times E_2 \times \cdots E_n. \\]

#### 2. 关系模型

1. 关系模型的函数依赖
   设 \\(R(U)\\) 是属性集 \\(U\\) 上的关系模式 \\(X, Y\\) 是 \\(U\\) 的子集 。 若对于 \\(R(U)\\) 的任意一个可能的关系 \\(r\\)，\\(r\\) 中不可能存在两个元组在 \\(X\\)上的属性值相等，而在 \\(Y\\) 上的属性值不相等，则称 \\(X\\) 函数确定 \\(Y\\) 或 \\(Y\\) 函数依赖于\\(X\\)，记作\\(X \rightarrow Y\\)。

2. 函数依赖的衍生问题：关系数据库的规范化
   - 关系数据库的规范化范式为：\\(1NF\supset 2NF \supset 3NF\supset BCN\supset 4NF\supset 5NF \\)。
   - 1NF的要求为：属性不可再分。
   - 2NF需要强化为：非主属性完全依赖于主属性，即**消除部分依赖**。
     - 部分依赖：在关系模式 \\(R(U)\\) 中，如果 \\(X \rightarrow Y\\)，并且存在 \\(X\\) 的一个真子集\\(X_0\\)，使得\\(X_0 \rightarrow Y\\)，则称 \\(Y\\) 对\\(X\\) 部分函数依赖.
   - 3NF需要强化为：属性不依赖于其他非主属性，即**消除传递依赖**。
     - 传递依赖：在关系模式 \\(R(U)\\) 中，如果 \\(X \rightarrow Y\\)， \\(Y \rightarrow Z\\)，且 \\(Y \nrightarrow X,Z\\) （其中\\(Z \nsubseteq Y\\)）,那么称 \\(X \rightarrow Z\\) 是传递依赖。

3. 数据异常：

|异常名称|描述/举例|
|---|---|
|数据冗余|院长的姓名会重复出现，重复的次数与该学院学生的人数相同|
|更新异常|学院更换院长必须修改与该学院学生有关的每一个元组|
|插入异常|学院刚成立尚无学生，则这个学院及其院长的信息就无法存入数据库|
|删除异常|删除该学院所有学生信息的同时，也把这个学院的信息全部删除了。|

1. **数据规范化规则**
   1. 每个关系只包含一个实体集，每个实体集只有一个主题；
   2. 每个关系只有一个主键；
   3. 属性中只包含原子数据；
   4. 不存在重复属性。

2. 关系数据完整性规则
   - **实体完整性**规则：保证关系中元组唯一的特性；
   - **域完整性**规则：保证关系中属性取值正确、有效的特性；
   - **参照完整性**规则： 其核心要求为外键值必须为空或等于被参照关系中的主键值，以此避免引用不存在的实体。
   - **用户定义完整性**：满足用户特定需要而设定的规则。

3. 将E-R模型转换为关系模型的方法：
   1. 实体的转换规则：每个实体型都转换为一个独立的关系；
   2. **联系的转换**：根据联系类型区分
      1. 1:1 联系：任意一端实体的主键合并到另一端对应的表中，
      2. 1:N 或 N:1：在多端实体对应的表中加入 1 端实体的主键作为外键，
      3. M:N：建立新表，包括双方尸体的主键和联系自身的属性；
   3. 最后进行规范化。

#### 3. 关系数据操作

1. 集合运算（略）
2. 单表关系运算
    - 投影（\\(\pi\\)）：选择**属性**（**列**）的子集，
    - 选择（\\(\sigma\\)）：选择**元组**（**行**）的子集；
3. 多表关系运算
   - 笛卡尔积
    关系 $R$ 与关系 $S$ 的笛卡尔积，通常记作 $R \times S$。它是一个新关系，其数学定义如下：$$R \times S = \{ (r_1, \dots, r_n, s_1, \dots, s_m) \mid (r_1, \dots, r_n) \in R \land (s_1, \dots, s_m) \in S \}.$$即强行将两个关系中的所有元组组合在一起。
    其中笛卡尔积得到的新表，列数等于原表格列数之和，行数等于原表格行数之积。
   - \\(\theta\\) 连接。关系代数中的所有连接都是笛卡尔积经过选择或投影运算后的结果，即$$R \bowtie_{R.A \, \theta \, S.B} S = \sigma_{R.A \, \theta \, S.B} (R \times S).$$
   - 外连接。首先包含等值连接的结果；对于指定表中没匹配上的行，也要保留，但零一部分的列**补为 `NULL`**（空值）。

|连接类型|关系代数表达式 / 定义|为什么是子集？|
|---|---|-|
|等值连接|$\sigma_{R.A = S.B}(R \times S)$|它是笛卡尔积中，两表指定列值相等的那部分子集。|
|非等值连接|$\sigma_{R.A > S.B}(R \times S)$|它是笛卡尔积中，满足特定范围或大小关系的子集。|
|自然连接|$\pi_{L}(\sigma_{R.A_1=S.A_1 \land \dots}(R \times S))$|它先取两表同名属性值相等的笛卡尔积子集，再通过投影（$\pi$）**去掉重复的列**。虽然列数变少了，但从行数据的逻辑组合来看，它依然源于笛卡尔积。|



## 主题2 结构化查询语言 SQL

SQL 支持数据操作,用于描述数据的动态特性。SQL 包括4个主要功能:数据定义语言（DDL）、数据查询语言（DQL）、数据操纵语言（DML）、数据控制语言（DCL）。
SQL 语言的优点在于 SQL 不是面向过程的语言,使用 SQL 语言只需描述做什么,而不需要描述如何做,为使用者带来极大的方便。

### 2-1 DQL 数据查询语言

#### 1. 语法结构

BCNF基本符号说明

| 符号 | 含义 |
| --- | --- |
| `[ ]` | 可选内容 |
| `{ }` | 必须选择其一 |
| `\|` | “或” |
| `[, ...]` | 可无限重复（前面内容的列表） |
| 大写单词 | 关键字 |
| 小写单词 | 用户变量 |

```SQL
SELECT [predicate] { * | table.* | [table.]field1 [AS alias1]
                                   [, [table.]field2 [AS alias2] [, ...]]}
FROM table_names
[INNER | {LEFT | RIGHT | FULL} [OUTER] | CROSS] JOIN table_B [AS] alias_B
    ON join_condition
[WHERE search_criteria ]
[GROUP BY groupfieldlist
          [HAVING aggregate_criteria]]
[ORDER BY column_criteria [ASC | DESC]]
;
```

说明：

1. 查询动词 `SELECT`
   1. `[predicate]`谓词选项：`[ALL | DISTINCT]` 或 `TOP n [PERCENT]`，默认为`ALL`。
      - `ALL` 指定要包含满足后面限制条件的所有行。
      - `DISTINCT` 会使查询结果中的行是唯一的(删除重复的行)。
      - `TOP n [PERCENT]`只返回结果集的前n行或n百分比行。
   2. `{ * | table.* | [table.]field1 [AS alias1][, [table.]field2 [AS alias2] [, ...]]}`字段选择。共有三个选项。
      - `*` 表示选择所有字段。
      - `field1`，`field2`：字段名称。该字段包含了用户要获取的数据。如果数据包含多个字则按列举顺序依次获取它们。
      - `alias1`，`alias2`：名称，在查询结果中代替 `table` 中原有的列名。
2. 指定查询源 `FROM tabe_names`：指定查询的源多个表用逗号分隔。
3. 查询条件 `WHERE search_criteria`：其后为逻辑表达式。
4. 排序动词 `ORDER BY column_criteria`：使用关键词 `column_criteria` 对查询结果进行排序，`ASC`或`DESC`用于指定升序或降序，默认为升序（`ASC`）。
5. 聚合动词 `GROUP BY groupfieldlist`：将记录与指定字段中的相等值组合成单一记录。对于蕴含在 `SELECT` 语句中的 `Sum` 或 `Count` 等合计函数，会创建一个各记录的总计值。
6. 聚合筛选 `HAVING aggregate_criteria`：对分组以后的记录显示进行限定。

#### 2. 使用 `WHERE` 选择记录

1. 基础比较算符：`=`，`>`，`<`，`<>`，`>=`，`<=>`。
2. 集合与范围运算符：
   1. `IN (...)`：判断字段值是否在给定的罗列值或子查询结果中。
   2. `BETWEEN ... AND ...`判断数值或日期是否在给定的两个值组成的闭区间中。
3. 模糊匹配：
   1. `LIKE` 配合通配符
      - `*` 任意长度的任意字符（包含0），例如所有用 gmail 邮箱的邮箱账户均为`'*@gmail.com'`，
      - `?` 代表一个任意字符，比如名字三个字且姓张的人为`'张??'`
   2. `REGEXP` 或 `RLIKE`：使用正则表达式，比如 `'^1[3-9][0-9]{9}$'` 代表中国大陆手机号。
4. 空值判断：`IS NULL` 和 `IS NOT NULL`：为空时分别为 `TRUE` 和 `FALSE`。
5. 复合逻辑运算符：使用 `AND`（与）`OR`（或）`NOT`连接多个逻辑判断，注意使用括号标注优先级。

| 通配符 | 含义说明 | 语法示例 | 匹配结果举例 | 不匹配结果举例 |
| --- | --- | --- | --- | --- |
| `*` | 匹配**零个或多个**任意字符 | `LIKE '张*'` | **张**三、**张**三丰 | 小张 |
| `?`| 匹配**单个**任意字符 | `LIKE '张?'` | **张三** | 张、张三丰 |
| `#` | 匹配**单个**任意数字（0-9） | `LIKE '2026-#-#'` | 2026-**6**-**4** | 2026-06-04（位数不对） |
| `[charlist]` | 匹配字符集列表中的**任意一个**字符 | `LIKE '[张李]四'` | **张**四、**李**四 | 王四 |
| `[!charlist]` | 匹配**不在**字符集列表中的 任意一个字符 | `LIKE '[!0-9]abc'` | **A**abc、**m**abc | 5abc |
| `-` *(需在方括号内)* | 指定字符的**连续范围** | `LIKE '[a-c]at'` | **a**at、**b**at、**c**at | dat |

#### 3. 多表查询

**1. 隐式链接**（不涉及到 `JOIN`）：将多个表名写在 `FROM` 后，用逗号隔开，在 `WHERE` 中写连接条件。

```SQL
SELECT 
    e.emp_name, 
    d.dept_name
FROM 
    employees AS e, 
    departments AS d
WHERE 
    e.dept_id = d.dept_id; -- 关联表
```

**2. 连表查询** `JOIN ... ON ...`

- 内连接 `INNER JOIN`：只返回两张表中完全匹配的行。

   ```SQL
   SELECT e.emp_name, d.dept_name
   FROM employees AS e
   INNER JOIN departments AS d ON e.dept_id = d.dept_id;
   ```

- 外连接 `LEFT JOIN` 或 `RIGHT JOIN`：同对应的外连接。

   ```SQL
   SELECT u.user_name, o.order_id
   FROM users AS u
   LEFT JOIN orders AS o ON u.user_id = o.user_id;
   ```

- 笛卡尔积 `CROSS JOIN`

**3. 组合查询** `UNION`：连接两个 `SELECT` 语句

   1. `UNION`：求并集并去重。
   2. `UNION *`：求并集但不去重。
   3. `INTERSECT`：求交集。
   4. `EXCEPT`：差集。

<div class="custom-box-warn">
  <strong>注意：</strong> 被组合的多个 \`SELECT`\ 语句，其列的数量、列的顺序以及对应位置的数据类型必须完全一致，否则会报错。
</div>

#### 4. 子查询

子查询的一般求解方法是**由里向外**处理，即每一个子查询在上一级查询处理之前求解。子查询的结果用于建立其父查询的查询条件。外层查询依赖于内层查询的结果，内层查询与外层查询无关。通常的情况，当查询的**结果出自一个表**，**条件涉及多个表**时，使用子查询。

#### 5. 分组查询

1. 常用聚合指标
   1. `COUNT()`：统计每个分组内的行数或非空值数量。
   2. `SUM()`：计算每个分组内数值列的总和。
   3. `AVG()`：计算每个分组内数值列的平均值。
   4. `MAX()` / `MIN()`：找出每个分组内的最大值或最小值。

2. `HAVING`：用于筛选聚合指标符合条件的用于展示。例如：

```SQL
-- 需求：找出今年（2026年）总销售额超过 50000 的商品类别
SELECT
    category_id,
    SUM(price) AS total_sales
FROM
    orders
WHERE
    order_date >= '2026-01-01'  -- 1. 分组前：先过滤出 2026 年的订单
GROUP BY
    category_id                 -- 2. 分组：按商品类别打包
HAVING
    SUM(price) > 50000;         -- 3. 分组后：只要总销售额大于 50000 的类别
```

### 2-2 DML 数据操纵语言

#### 1. 追加

语法：

```SQL
INSERT INTO target [(field1 [, field2 [, ...]])]
VALUES 
    (valuel [, value2 [,...]])

```

数据列表中各数据的排列顺序必须与目标表的字段名排列顺序一致。另外注意各种类型数据的表示方法。

```SQL
INSERT INTO users (user_name, email, age) 
VALUES 
    ('张三', 'zhangsan@example.com', 25),
    ('李四', 'lisi@example.com', 30);
```

#### 2. 更新

语法：

```SQL
UPDATE table name
   SET column_name = value [, column_name = value [, ...]]
   WHERE updatecriteria
```

注意不要遗漏 `WHERE` 限制条件。

```SQL
UPDATE users 
SET status = 'premium', score = score + 100
WHERE id = 101;
```

#### 3. 删除

语法：

```SQL
DELETE FROM table_name
   [WHERE delete_criteria ]
```

注意：`DELETE FROM table;` 为逐行删除并添加删除日志，支持回滚，但是 `TRUNCATE TABLE table;` 会删除整张表格并建立一张新表，不支持回滚。

```SQL
DELETE FROM users 
WHERE status = 'inactive' AND expired_date < '2026-01-01';
```

### 2-3 DDL 数据定义语言

<div class="custom-box-warn">
  <strong>注意：</strong> 在绝大多数关系型数据库（如 MySQL、Oracle）中，DDL 语句不支持事务回滚，是很危险的操作。
</div>

#### 1. 创建表

语法：

```SQL
CREATE [TEMPORARY] TABLE table name
   (field1 type [(size)] [NOT NULL] [ index1 ]
   [, field2 type [(size)] [NOT NULL] [ index2][, .]]
   [CONSTRAINT multifieldindex [, ...]])
```

1. 在定义语句中，文本型字段类型可用 `TEXT`，`CHAR` 或 `VARCHAR` 表示，可指定长度。不指定长度，默认为255。
2. 日期型字段类型用 `DATETIME` 表示。
3. 货币型字段类型用 `MONEY` 表示。
4. 双精度字段类型用 `NUMBER`，整型用 `INT` 或 `LONG` 表示。
5. OLE 对象用 `IMAGE` 表示。

建立 `TEMPORARY` 表时，只能在建立表的会话期间看见它。会话期终止时，它就被自动删除。`TEMPORARY` 表能被不止一个用户访问。

示例：

```SQL
CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),   --定义主键
    UNIQUE (email)
);
```

#### 2. 修改表

语法：

```SQL
ALTER TABLE table_name {ADD {COLUMN field_name type [(size)]
   [NOT NULL] [CONSTRAINT index ] |
   ALTER COLUMN field1 type [ (size)]|
   CONSTRAINT multifieldindex } |
   DROP {COLUMN field_name | CONSTRAINT indexname }}
```

1. `ADD COLUMN`：在表中添加新的字段。需要指定字段名、数据类型，还可以（对文
本和二进制字段）指定长度。
2. `ALTER COLUMN`：改变字段的数据类型，需要指定字段名、新数据类型，还可以指
定长度。
3. `ADD CONSTRAINT`：添加多重字段索引。
4. `DROP COLUMN`：删除字段。
5. `DROP CONSTRAINT`：删除多重字段索引。

示例：

```SQL
-- 示例：为用户表新增一个“手机号”字段，并修改“邮箱”字段的长度
ALTER TABLE users ADD phone_number VARCHAR(20);
ALTER TABLE users MODIFY email VARCHAR(150);
```

#### 3. 删除表

语法：

```SQL
DROP {TABLE table_name | INDEX index_name ON table }
```

1. `table_name`:指定从数据库中删除的表。
2. `index_name`:指定删除的索引。

## 主题3 Access操作

(...)
