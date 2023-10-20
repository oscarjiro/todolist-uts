<?php

require_once(__DIR__ . "/init.php");

// Get session username
$username = $_SESSION["username"];

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <?= head("Home") ?>
    <script src="static/scripts/index.js" type="module"></script>
</head>

<body>
    <!-- Navbar -->
    <?= navbar() ?>

    <!-- Main -->
    <main class="flex flex-col w-full space-y-10 opacity-0">
        <!-- Greeting -->
        <section>
            <!-- Greeting -->
            <div class="greeting">
                <?= greet() ?>, <?= $username ?>.
            </div>
        </section>

        <!-- Dashboard -->
        <section class="dashboard">
            <!-- Date -->
            <div>
                <div class="dashboard-title">
                    Today's <?= get_curday() ?>
                </div>
                <div class="dashboard-footer">
                    <?= convert_date(get_curdate())  ?>
                </div>
            </div>

            <!-- Progress -->
            <div class="min-[500px]:text-right min-[700px]:text-left">
                <div id="completedTasksPercentage" class="dashboard-title">
                    0% Done
                </div>
                <div class="dashboard-footer">
                    Completed Tasks
                </div>
            </div>
        </section>

        <!-- Add -->
        <a href="add.php" class="add group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="add-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <div class="add-text">Add new task</div>
        </a>

        <!-- Section -->
        <section>
            <!-- Section Titles -->
            <div class="section-title-ctr">
                <div class="section-title-bg"></div>
                <div class="section-title-item-ctr">
                    <div id="allSection" class="section-title-item-active group" data-active="true">
                        <div id="allSectionCount" class="section-title-count-active">0</div>
                        <div class="section-title-text">All tasks</div>
                    </div>
                    <?php
                    foreach (TASK_PROGRESS as $progress) {
                    ?>
                        <div id="<?= to_camel_case($progress) . "Section" ?>" class="section-title-item group" data-active="false">
                            <div id="<?= to_camel_case($progress) ?>SectionCount" class="section-title-count">0</div>
                            <div class="section-title-text"><?= $progress ?></div>
                        </div>
                    <?php
                    }
                    ?>
                </div>
            </div>

            <!-- Tasks -->
            <div id="tasksContainer" class="space-y-6 smooth">
            </div>
        </section>
    </main>
</body>

</html>